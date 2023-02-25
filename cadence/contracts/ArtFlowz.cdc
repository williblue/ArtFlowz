// ArtFlowz
// Author: williblue
// Email: williblueblue@gmail.com
// Purpose: Request artwork commissions and pay with USDC

import FiatToken from "./FiatToken.cdc"
import FungibleToken from "./FungibleToken.cdc"
import CreatorProfile from "./CreatorProfile.cdc"
import ArtPiece from "./ArtPiece.cdc"

pub contract ArtFlowz {

    // Events
    pub event CommissionCreated(
                                creatorAddress: Address, 
                                commissionerAddress: Address, 
                                commissionID: UInt64, 
                                commissionAmount: UFix64,
                                genre: String, 
                                NSFW: Bool, 
                                notes: String, 
                                link: String, 
                                uploadFile: String
                                )
    pub event CommissionDestroyed(id: UInt64, creatorAddress: Address)
    pub event CreatorAcceptedCommission(creatorAddress: Address, commissionerAddress: Address, commissionID: UInt64, commissionAmount: UFix64)
    pub event CreatorRejectedCommission(creatorAddress: Address, commissionerAddress: Address, commissionID: UInt64, commissionAmount: UFix64)
    pub event CreatorCompletedCommission(creatorAddress: Address, commissionerAddress: Address, commissionID: UInt64, commissionAmount: UFix64)
    pub event FeedbackGiven(creatorAddress: Address, commissionerAddress: Address, commissionID: UInt64, starRating: UInt32, comments: String)

    // Named paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath

    // Contract fields
    pub let platformWallet: Capability<&FiatToken.Vault{FungibleToken.Receiver}>
    access(self) var commissioners: [Address]

    pub struct CommissionDetails {
        pub let commissionID: UInt64
        pub let genre: String
        pub let NSFW: Bool
        pub let notes: String
        pub let link: String
        pub let uploadFile: String
        pub var accepted: Bool
        pub var rejected: Bool
        pub var completed: Bool


        access(contract) fun setToAccepted() {
            pre {
                !self.rejected: "Can't accept commission: Commission has been rejected."
            }
            self.accepted = true
        }

        access(contract) fun setToRejected() {
            pre {
                !self.accepted: "Can't accept commission: Commission has already been accepted."
            }
            self.rejected = true
        }

        access(contract) fun setToCompleted() {
            pre {
                self.accepted: "Can't complete commission: Commission must first be accepted."
                !self.rejected: "Can't complete commission: Commission has been rejected."
            }
            self.completed = true
        }

        init(commissionID: UInt64, genre: String, NSFW: Bool, notes: String, link: String, uploadFile: String) {
            self.commissionID = commissionID
            self.genre = genre
            self.NSFW = NSFW
            self.notes = notes
            self.link = link
            self.uploadFile = uploadFile
            self.accepted = false
            self.rejected = false
            self.completed = false
        }
    }

    pub struct Feedback {
        pub let starRating: UInt32
        pub let comments: String

        init(starRating: UInt32, comments: String) {
            self.starRating = starRating
            self.comments = comments
        }
    }

    pub resource interface CommissionPublic {
        pub let creatorAddress: Address
        pub fun getFee(): UFix64
        pub fun getDetails(): CommissionDetails
        pub fun getCommissionedArtPiece(): String?
        pub fun getFeedback(): Feedback?
        pub fun accept(creatorManager: &CreatorProfile.CreatorManager)
        pub fun reject(creatorManager: &CreatorProfile.CreatorManager)
        pub fun complete(
                        commissionedArtPiece: String, 
                        receiverCapability: Capability<&FiatToken.Vault{FungibleToken.Receiver}>, 
                        creatorManager: &CreatorProfile.CreatorManager)
    }

    pub resource Commission: CommissionPublic {
        pub let creatorAddress: Address
        access(self) var fee: UFix64
        access(contract) let details: CommissionDetails
        access(contract) let vaultRefCapability: Capability<&FiatToken.Vault{FungibleToken.Provider, FungibleToken.Balance}>
        access(contract) var commissionedArtPiece: String?
        access(contract) var feedback: Feedback?
        
        init(
            creatorAddress: Address,
            commissionAmount: UFix64, 
            genre: String, 
            NSFW: Bool, 
            notes: String, 
            link: String, 
            uploadFile: String,
            vaultRefCapability: Capability<&FiatToken.Vault{FungibleToken.Provider, FungibleToken.Balance}>
            ) {
                pre {
                    vaultRefCapability.borrow()!.balance >= commissionAmount: "commissioner's vault doesn't have enough USDC for the commission!"
                }
                self.creatorAddress = creatorAddress
                self.fee = commissionAmount
                self.details = CommissionDetails(
                                                commissionID: self.uuid, 
                                                genre: genre, 
                                                NSFW: NSFW, 
                                                notes: notes, 
                                                link: link, 
                                                uploadFile: uploadFile
                                                )
                self.vaultRefCapability = vaultRefCapability
                self.commissionedArtPiece = nil
                self.feedback = nil

                emit CommissionCreated(
                                creatorAddress: self.creatorAddress, 
                                commissionerAddress: vaultRefCapability.address, 
                                commissionID: self.details.commissionID, 
                                commissionAmount: self.fee,
                                genre: self.details.genre, 
                                NSFW: self.details.NSFW, 
                                notes: self.details.notes, 
                                link: self.details.link, 
                                uploadFile: self.details.uploadFile
                                )
        }

        // Creator
        pub fun accept(creatorManager: &CreatorProfile.CreatorManager) {
            pre {
                creatorManager.owner!.address == self.creatorAddress: "Can't accept commission: The creator address doesn't match."
            }
            self.details.setToAccepted()
            emit CreatorAcceptedCommission(
                                creatorAddress: self.creatorAddress, 
                                commissionerAddress: self.vaultRefCapability.address,
                                commissionID: self.details.commissionID, 
                                commissionAmount: self.fee
                                )
        }

        // Creator
        pub fun reject(creatorManager: &CreatorProfile.CreatorManager) {
            pre {
                creatorManager.owner!.address == self.creatorAddress: "Can't reject commission: The creator address doesn't match."
            }
            self.details.setToRejected()
            emit CreatorRejectedCommission(
                                creatorAddress: self.creatorAddress, 
                                commissionerAddress: self.vaultRefCapability.address,
                                commissionID: self.details.commissionID, 
                                commissionAmount: self.fee
                                )
        }

        // Creator
        pub fun complete(commissionedArtPiece: String, receiverCapability: Capability<&FiatToken.Vault{FungibleToken.Receiver}>, creatorManager: &CreatorProfile.CreatorManager) {
            pre {
                creatorManager.owner!.address == self.creatorAddress: "Can't complete commission: The creator address doesn't match."
                self.vaultRefCapability.borrow()!.balance >= self.fee: "Can't complete commission: Not enough USDC in commissioner's vault"
            }

            let payment <- self.vaultRefCapability.borrow()!.withdraw(amount: self.fee)

            // pay ArtFlowz platform
            let platformWallet = ArtFlowz.platformWallet.borrow()!
            let platformFee = self.fee * 0.025 // 2.5% platform fee
            platformWallet.deposit(from: <-payment.withdraw(amount: platformFee))

            // pay creator
            receiverCapability.borrow()!.deposit(from: <-payment)

            self.commissionedArtPiece = commissionedArtPiece

            emit CreatorCompletedCommission(
                                creatorAddress: self.creatorAddress, 
                                commissionerAddress: self.vaultRefCapability.address,
                                commissionID: self.details.commissionID, 
                                commissionAmount: self.fee
                                )
        }

        // Commissioner
        pub fun giveFeedback(starRating: UInt32, comments: String) {
            pre {
                self.details.completed: "Can't create feedback: Commission must first be completed."
                self.feedback == nil: "Can't create feedback: Feedback has already beeng give"
            }
            self.feedback = Feedback(starRating: starRating, comments: comments)
            emit FeedbackGiven(
                                creatorAddress: self.creatorAddress, 
                                commissionerAddress: self.vaultRefCapability.address,
                                commissionID: self.details.commissionID, 
                                starRating: starRating,
                                comments: comments
                                )
        }

        // Commissioner
        pub fun mint(name: String, description: String, image: String, creatorAddress: Address): @ArtPiece.NFT {
            pre {
                self.details.completed: "Can't mint artwork: Commission must first be completed."
            }
            return <-ArtPiece.mint(name: name, description: description, image: image, creatorAddress: creatorAddress)
        }

        pub fun getFee(): UFix64 {
            return self.fee
        }
        
        pub fun getDetails(): CommissionDetails {
            return self.details
        }

        pub fun getCommissionedArtPiece(): String? {
            return self.commissionedArtPiece
        }

        pub fun getFeedback(): Feedback? {
            return self.feedback
        }

        destroy() {
            emit CommissionDestroyed(id: self.uuid, creatorAddress: self.creatorAddress)
        }
        
    }

    pub resource interface CommissionCollectionPublic {
        pub fun getIDs(): [UInt64]
        pub fun borrowCommission(id: UInt64): &ArtFlowz.Commission{CommissionPublic}? {
            post {
                (result == nil) || (result?.uuid == id): 
                    "Cannot borrow Commission reference: The ID of the returned reference is incorrect"
            }
        }
    }

    pub resource CommissionCollection: CommissionCollectionPublic {
        access(self) var commissions: @{UInt64: Commission}

        init() {
            self.commissions <- {}
        }

        pub fun createCommission(
                                creatorAddress: Address,
                                commissionAmount: UFix64, 
                                genre: String, 
                                NSFW: Bool, 
                                notes: String, 
                                link: String, 
                                uploadFile: String,
                                vaultRefCapability: Capability<&FiatToken.Vault{FungibleToken.Provider, FungibleToken.Balance}>
                                ) {
            
            let newCommission <- create Commission(
                                            creatorAddress: creatorAddress,
                                            commissionAmount: commissionAmount, 
                                            genre: genre, 
                                            NSFW: NSFW, 
                                            notes: notes, 
                                            link: link, 
                                            uploadFile: uploadFile,
                                            vaultRefCapability: vaultRefCapability
                                            )
            
            // Add commissioner to list
            if(!ArtFlowz.commissioners.contains(self.owner!.address)) {
                ArtFlowz.commissioners.append(self.owner!.address)
            }

            let commissionID = newCommission.uuid
            let oldCommission <- self.commissions[commissionID] <- newCommission
            destroy oldCommission
        }

        pub fun cancelCommission(id: UInt64) {
            let commission <- self.commissions.remove(key: id)
                ?? panic("Cannot remove commission: Commission doesn't exist in the collection")
            destroy commission
        }

        pub fun getIDs(): [UInt64] {
            return self.commissions.keys
        }

        pub fun borrowCommission(id: UInt64): &ArtFlowz.Commission{CommissionPublic}? {
            let ref = &self.commissions[id] as! &ArtFlowz.Commission{CommissionPublic}?
            return ref
        }

        pub fun borrowEntireCommission(id: UInt64): &ArtFlowz.Commission? {
            let ref = &self.commissions[id] as! &ArtFlowz.Commission?
            return ref
        }

        destroy() {
            destroy self.commissions
        }
    }

    pub fun createCommissionCollection(): @ArtFlowz.CommissionCollection {
        return <- create self.CommissionCollection()
    }

    pub fun getCommissioners(): [Address] {
        return ArtFlowz.commissioners
    }

    init() {

        // Set named paths
        self.CollectionStoragePath = /storage/ArtFlowzCommissionCollection
        self.CollectionPublicPath = /public/ArtFlowzCommissionCollection

        if self.account.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath) == nil {
            // Create a new USDC Vault and put it in storage
            self.account.save(<-FiatToken.createEmptyVault(), to: FiatToken.VaultStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            self.account.link<&FiatToken.Vault{FungibleToken.Receiver}>(
                FiatToken.VaultReceiverPubPath,
                target: FiatToken.VaultStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            self.account.link<&FiatToken.Vault{FungibleToken.Balance}>(
                FiatToken.VaultBalancePubPath,
                target: FiatToken.VaultStoragePath
            )
        }

        // Initialize the fields
        self.platformWallet = self.account.getCapability<&FiatToken.Vault{FungibleToken.Receiver}>(FiatToken.VaultReceiverPubPath)
        self.commissioners = []

    }

}
 