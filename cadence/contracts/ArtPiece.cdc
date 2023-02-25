import FungibleToken from "./FungibleToken.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"
import FlowToken from "./FlowToken.cdc"

pub contract ArtPiece: NonFungibleToken {

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event ArtPieceMinted(id: UInt64)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let CollectionPrivatePath: PrivatePath

    pub var totalSupply: UInt64
    
    pub resource interface Public {
        pub let id: UInt64
        pub let name: String
        pub let description: String
        pub let image: String
    }

    pub resource NFT: NonFungibleToken.INFT, Public, MetadataViews.Resolver {

        pub let id: UInt64
        pub let name: String
        pub let description: String
        pub let image: String
        access(self) let royalties: [MetadataViews.Royalty]
    
        init(name: String, description: String, image: String, creatorAddress: Address) {
            self.id = self.uuid
            self.name = name
            self.description = description
            self.image = image
            self.royalties = [MetadataViews.Royalty(
							recepient: getAccount(creatorAddress).getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver),
							cut: 0.1,
							description: "10% creator royalty from secondary sales."
						)]

            ArtPiece.totalSupply = ArtPiece.totalSupply + 1

            emit ArtPieceMinted(id: self.id)
        }
    
        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Royalties>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name,
                        description: self.description,
					    thumbnail: MetadataViews.IPFSFile(cid: self.image, path: nil)
                    )
                case Type<MetadataViews.Royalties>():
                    return MetadataViews.Royalties(
                        self.royalties
                    )
            }
            return nil
        }
    }

    pub resource interface ArtPieceCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowArtPiece(id: UInt64): &ArtPiece.NFT{Public}? { 
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow Art Piece reference: The ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: ArtPieceCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {

        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @ArtPiece.NFT

            let id: UInt64 = token.id

            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }
 
        pub fun borrowArtPiece(id: UInt64): &ArtPiece.NFT{Public}? {
            let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT?
            return ref as! &ArtPiece.NFT?
        }

        pub fun borrowEntireArtPiece(id: UInt64): &ArtPiece.NFT? {
            let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT?
            return ref as! &ArtPiece.NFT?
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let ArtPiece = nft as! &ArtPiece.NFT
            return ArtPiece as &AnyResource{MetadataViews.Resolver}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    access(account) fun mint(name: String, description: String, image: String, creatorAddress: Address): @NFT {
            var newNFT <- create NFT(name: name, description: description, image: image, creatorAddress: creatorAddress)

            return <-newNFT
    }

    init() {
        // Initialize contract fields
        self.totalSupply = 0

        // Set the named paths
        self.CollectionStoragePath = /storage/ArtPieceCollection
        self.CollectionPublicPath = /public/ArtPieceCollection
        self.CollectionPrivatePath = /private/ArtPieceCollection

        emit ContractInitialized()
    }
}
 