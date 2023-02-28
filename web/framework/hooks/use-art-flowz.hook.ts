import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import {
  query,
  send,
  transaction,
  args,
  arg,
  payer,
  proposer,
  authorizations,
  limit,
  authz,
  decode,
  tx,
} from "@onflow/fcl"
import * as t from "@onflow/types"
import { toastStatus } from "../toastStatus"

export default function useArtFlowz() {
  const [allCommissions, setAllCommissions] = useState()

  useEffect(() => {
    getAllCommissions()
  }, [])

  const createCommission = async (
    creatorAddress: String,
    commissionAmount: string,
    genre: String,
    NSFW: Boolean,
    notes: String,
    link: String,
    uploadFile: String,
    handleThankYouModalOpen: () => void,
  ) => {
    const id = toast.loading("Initializing...")

    try {
      const res = await send([
        transaction(`
        import ArtFlowz from 0xArtFlowz
        import FungibleToken from 0xFungibleToken
        import FiatToken from 0xFiatToken

        transaction(creatorAddress: Address, 
                    commissionAmount: UFix64, 
                    genre: String, 
                    NSFW: Bool, 
                    notes: String, 
                    link: String, 
                    uploadFile: String) {

            prepare(acct: AuthAccount) {

                //Create Commission Collection
                if acct.borrow<&ArtFlowz.CommissionCollection{ArtFlowz.CommissionCollectionPublic}>(from: ArtFlowz.CollectionStoragePath) == nil {
                    acct.save(<- ArtFlowz.createCommissionCollection(), to: ArtFlowz.CollectionStoragePath)
                    acct.unlink(ArtFlowz.CollectionPublicPath)
                    acct.link<&ArtFlowz.CommissionCollection{ArtFlowz.CommissionCollectionPublic}>
                        (ArtFlowz.CollectionPublicPath, target: ArtFlowz.CollectionStoragePath)
                }
                let commissionCollectionRef = acct.borrow<&ArtFlowz.CommissionCollection>(from: ArtFlowz.CollectionStoragePath)!

                //Link the private USDC vault capability
                let vaultRefPrivatePath = /private/FiatTokenArtFlowz

                if !acct.getCapability<&FiatToken.Vault{FungibleToken.Provider, FungibleToken.Balance}>(vaultRefPrivatePath).check() {
                    acct.link<&FiatToken.Vault{FungibleToken.Provider, FungibleToken.Balance}>(vaultRefPrivatePath, target: FiatToken.VaultStoragePath)
                }
                //Get the private USDC vault capability
                let vaultRefCapability = acct.getCapability<&FiatToken.Vault{FungibleToken.Provider, FungibleToken.Balance}>(vaultRefPrivatePath)
                
                commissionCollectionRef.createCommission(
                                                        creatorAddress: creatorAddress, 
                                                        commissionAmount: commissionAmount, 
                                                        genre: genre, 
                                                        NSFW: NSFW, 
                                                        notes: notes, 
                                                        link: link, 
                                                        uploadFile: uploadFile, 
                                                        vaultRefCapability: vaultRefCapability
                                                        )

            }

        }
        `),
        args([
          arg(creatorAddress, t.Address),
          arg(parseFloat(commissionAmount).toFixed(2), t.UFix64),
          arg(genre, t.String),
          arg(NSFW, t.Bool),
          arg(notes, t.String),
          arg(link, t.String),
          arg(uploadFile, t.String),
        ]),
        payer(authz),
        proposer(authz),
        authorizations([authz]),
        limit(9999),
      ]).then(decode)
      tx(res).subscribe((res: any) => {
        toastStatus(id, res.status)
      })
      await tx(res)
        .onceSealed()
        .then((result: any) => {
          toast.update(id, {
            render: "Transaction Sealed",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          })
        })
      handleThankYouModalOpen()
      getAllCommissions()
    } catch (err) {
      toast.update(id, {
        render: "Error, try again later...",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
      console.log(err)
    }
  }

  const getAllCommissions = async () => {
    try {
      let res = await query({
        cadence: `
        import ArtFlowz from 0xArtFlowz

        pub fun main(): [AnyStruct] {
            var commissions:[AnyStruct]  = []

            let commissioners = ArtFlowz.getCommissioners()

            for address in commissioners {
                let collectionRef = getAccount(address).getCapability(ArtFlowz.CollectionPublicPath)
                    .borrow<&{ArtFlowz.CommissionCollectionPublic}>()

                    if (collectionRef != nil) {
                      let IDs = collectionRef!.getIDs()

                      for id in IDs {
                        let commission = collectionRef!.borrowCommission(id: id)
                        if (commission != nil) {
                            let c = commission!
                            let d = c.getDetails()
                            let object = {
                                "commissionID": d.commissionID,
                                "commissionAmount": c.getFee(),
                                "creatorAddress": c.creatorAddress,
                                "commissionerAddress": address,
                                "status": d.completed ? "completed" : 
                                        d.rejected ? "rejected" :
                                        d.accepted ? "accepted" : "pending",
                                "genre": d.genre,
                                "nsfw": d.NSFW,
                                "notes": d.notes,
                                "link": d.link,
                                "uploadFile": d.uploadFile,
                                "commissionedArtPiece": c.getCommissionedArtPiece() !=nil ? c.getCommissionedArtPiece()! : nil,
                                "feedback": c.getFeedback()!=nil ? c.getFeedback()! : nil
                            }
                            commissions.append(object)
                        }
                      }

                    }
            }

            return commissions
        }
        `,
      })
      setAllCommissions(res)
    } catch (err) {
      console.log(err)
    }
  }

  const cancelCommission = async (commissionID: any, onClose: any) => {
    const id = toast.loading("Initializing...")

    try {
      const res = await send([
        transaction(`
        import ArtFlowz from 0xArtFlowz

        transaction(id: UInt64) {

            prepare(acct: AuthAccount) {

                //Get Commission Collection
                let commissionCollectionRef = acct.borrow<&ArtFlowz.CommissionCollection>(from: ArtFlowz.CollectionStoragePath)??
                                                                                panic("Can't get commission collection!")

                commissionCollectionRef.cancelCommission(id: id)
            }

        }
        `),
        args([arg(commissionID, t.UInt64)]),
        payer(authz),
        proposer(authz),
        authorizations([authz]),
        limit(9999),
      ]).then(decode)
      tx(res).subscribe((res: any) => {
        toastStatus(id, res.status)
      })
      await tx(res)
        .onceSealed()
        .then((result: any) => {
          toast.update(id, {
            render: "Transaction Sealed",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          })
        })
      getAllCommissions()
      onClose()
    } catch (err) {
      toast.update(id, {
        render: "Error, try again later...",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
      console.log(err)
    }
  }

  const acceptCommission = async (
    commissionerAddress: any,
    commissionID: any,
    onClose: any,
  ) => {
    const id = toast.loading("Initializing...")

    try {
      const res = await send([
        transaction(`
        import ArtFlowz from 0xArtFlowz
        import CreatorProfile from 0xCreatorProfile

        transaction(commissionerAddress: Address, id: UInt64) {

            prepare(acct: AuthAccount) {
                //Get Collection
                let collectionRef = getAccount(commissionerAddress).getCapability(ArtFlowz.CollectionPublicPath)
                                                .borrow<&{ArtFlowz.CommissionCollectionPublic}>()??
                                                                                panic("Can't get commission collection!")

                //Get commission
                let commission = collectionRef.borrowCommission(id: id)??
                                                                        panic("Can't get commission!") 

                //Create CreatorManager
                if acct.borrow<&CreatorProfile.CreatorManager>(from: CreatorProfile.CreatorManagerStoragePath) == nil {
                    acct.save(<- CreatorProfile.createCreatorManager(), to: CreatorProfile.CreatorManagerStoragePath)
                }
                let creatorManager = acct.borrow<&CreatorProfile.CreatorManager>(from: CreatorProfile.CreatorManagerStoragePath)!
                
                // Register creator
                CreatorProfile.registerCreator(creatorManager: creatorManager)

                commission.accept(creatorManager: creatorManager)
            }

        }
        `),
        args([
          arg(commissionerAddress, t.Address),
          arg(commissionID, t.UInt64),
        ]),
        payer(authz),
        proposer(authz),
        authorizations([authz]),
        limit(9999),
      ]).then(decode)
      tx(res).subscribe((res: any) => {
        toastStatus(id, res.status)
      })
      await tx(res)
        .onceSealed()
        .then((result: any) => {
          toast.update(id, {
            render: "Transaction Sealed",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          })
        })
      getAllCommissions()
      onClose()
    } catch (err) {
      toast.update(id, {
        render: "Error, try again later...",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
      console.log(err)
    }
  }

  const rejectCommission = async (
    commissionerAddress: any,
    commissionID: any,
    onClose: any,
  ) => {
    const id = toast.loading("Initializing...")

    try {
      const res = await send([
        transaction(`
        import ArtFlowz from 0xArtFlowz
        import CreatorProfile from 0xCreatorProfile

        transaction(commissionerAddress: Address, id: UInt64) {

            prepare(acct: AuthAccount) {
                //Get Collection
                let collectionRef = getAccount(commissionerAddress).getCapability(ArtFlowz.CollectionPublicPath)
                                                .borrow<&{ArtFlowz.CommissionCollectionPublic}>()??
                                                                                panic("Can't get commission collection!")

                //Get commission
                let commission = collectionRef.borrowCommission(id: id)??
                                                                        panic("Can't get commission!") 

                //Create CreatorManager
                if acct.borrow<&CreatorProfile.CreatorManager>(from: CreatorProfile.CreatorManagerStoragePath) == nil {
                    acct.save(<- CreatorProfile.createCreatorManager(), to: CreatorProfile.CreatorManagerStoragePath)
                }
                let creatorManager = acct.borrow<&CreatorProfile.CreatorManager>(from: CreatorProfile.CreatorManagerStoragePath)!

                commission.reject(creatorManager: creatorManager)
            }

        }
        `),
        args([
          arg(commissionerAddress, t.Address),
          arg(commissionID, t.UInt64),
        ]),
        payer(authz),
        proposer(authz),
        authorizations([authz]),
        limit(9999),
      ]).then(decode)
      tx(res).subscribe((res: any) => {
        toastStatus(id, res.status)
      })
      await tx(res)
        .onceSealed()
        .then((result: any) => {
          toast.update(id, {
            render: "Transaction Sealed",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          })
        })
      getAllCommissions()
      onClose()
    } catch (err) {
      toast.update(id, {
        render: "Error, try again later...",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
      console.log(err)
    }
  }

  const completeCommission = async (
    commissionerAddress: any,
    commissionID: any,
    commissionedArtPiece: any,
    onClose: any,
    closeParent: any,
  ) => {
    const id = toast.loading("Initializing...")

    try {
      const res = await send([
        transaction(`
        import ArtFlowz from 0xArtFlowz
        import CreatorProfile from 0xCreatorProfile
        import FungibleToken from 0xFungibleToken
        import FiatToken from 0xFiatToken

        transaction(commissionerAddress: Address, id: UInt64, commissionedArtPiece: String) {

            prepare(acct: AuthAccount) {
                // Check for USDC vault
                    if acct.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath) == nil {
                        acct.save(<-FiatToken.createEmptyVault(), to: FiatToken.VaultStoragePath)

                        // Create a public capability to the Vault that only exposes
                        // the deposit function through the Receiver interface
                        acct.link<&FiatToken.Vault{FungibleToken.Receiver}>(
                            FiatToken.VaultReceiverPubPath,
                            target: FiatToken.VaultStoragePath
                        )

                        // Create a public capability to the Vault that only exposes
                        // the balance field through the Balance interface
                        acct.link<&FiatToken.Vault{FungibleToken.Balance}>(
                            FiatToken.VaultBalancePubPath,
                            target: FiatToken.VaultStoragePath
                        )
                    }

                //Get collection
                let collectionRef = getAccount(commissionerAddress).getCapability(ArtFlowz.CollectionPublicPath)
                                                .borrow<&{ArtFlowz.CommissionCollectionPublic}>()??
                                                                                panic("Can't get commission collection!")

                //Get commission
                let commission = collectionRef.borrowCommission(id: id)??
                                                                        panic("Can't get commission!") 
                //Get creator manager
                let creatorManager = acct.borrow<&CreatorProfile.CreatorManager>(from: CreatorProfile.CreatorManagerStoragePath)??
                                                                        panic("Can't get creator manager!") 

                //Get USDC receiver capability
                let receiverCapability = acct.getCapability<&FiatToken.Vault{FungibleToken.Receiver}>(FiatToken.VaultReceiverPubPath)

                commission.complete(commissionedArtPiece: commissionedArtPiece, receiverCapability: receiverCapability, creatorManager: creatorManager)
            }

        }
        `),
        args([
          arg(commissionerAddress, t.Address),
          arg(commissionID, t.UInt64),
          arg(commissionedArtPiece, t.String),
        ]),
        payer(authz),
        proposer(authz),
        authorizations([authz]),
        limit(9999),
      ]).then(decode)
      tx(res).subscribe((res: any) => {
        toastStatus(id, res.status)
      })
      await tx(res)
        .onceSealed()
        .then((result: any) => {
          toast.update(id, {
            render: "Transaction Sealed",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          })
        })
      getAllCommissions()
      onClose()
      closeParent()
    } catch (err) {
      toast.update(id, {
        render: "Error, try again later...",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
      console.log(err)
    }
  }

  const mintCommission = async (
    commissionID: any,
    name: any,
    description: any,
    onClose: any,
    closeParent: any,
  ) => {
    const id = toast.loading("Initializing...")

    try {
      const res = await send([
        transaction(`
        import ArtFlowz from 0xArtFlowz
        import ArtPiece from 0xArtPiece
        import NonFungibleToken from 0xNonFungibleToken
        import MetadataViews from 0xMetadataViews

        transaction(id: UInt64, name: String, description: String) {

            prepare(acct: AuthAccount) {

                //Get Commission Collection
                let commissionCollectionRef = acct.borrow<&ArtFlowz.CommissionCollection>(from: ArtFlowz.CollectionStoragePath)??
                                                                                panic("Can't get commission collection!")
                //Get commission
                let commission = commissionCollectionRef.borrowEntireCommission(id: id)??
                                                                                panic("Can't get commission!")

                //Get ArtPiece Collection
                if acct.borrow<&ArtPiece.Collection{ArtPiece.ArtPieceCollectionPublic}>(from: ArtPiece.CollectionStoragePath) == nil {
                            acct.save(<- ArtPiece.createEmptyCollection(), to: ArtPiece.CollectionStoragePath)
                            acct.unlink(ArtPiece.CollectionPublicPath)
                            acct.link<&ArtPiece.Collection{NonFungibleToken.Receiver, 
                                NonFungibleToken.CollectionPublic, 
                                ArtPiece.ArtPieceCollectionPublic, 
                                MetadataViews.ResolverCollection}>
                                (ArtPiece.CollectionPublicPath, target: ArtPiece.CollectionStoragePath)
                        }
                let receiverRef = acct.borrow<&ArtPiece.Collection{ArtPiece.ArtPieceCollectionPublic}>(from: ArtPiece.CollectionStoragePath)!
                        

                //Mint
                let artPiece <- commission.mint(name: name, description: description, image: commission.getCommissionedArtPiece()!)

                receiverRef.deposit(token: <-artPiece)

            }

        }
        `),
        args([
          arg(commissionID, t.UInt64),
          arg(name, t.String),
          arg(description, t.String),
        ]),
        payer(authz),
        proposer(authz),
        authorizations([authz]),
        limit(9999),
      ]).then(decode)
      tx(res).subscribe((res: any) => {
        toastStatus(id, res.status)
      })
      await tx(res)
        .onceSealed()
        .then((result: any) => {
          toast.update(id, {
            render: "Your NFT has been minted!",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          })
        })
      getAllCommissions()
      onClose()
      closeParent()
    } catch (err) {
      toast.update(id, {
        render: "Error, try again later...",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
      console.log(err)
    }
  }

  return {
    createCommission,
    allCommissions,
    getAllCommissions,
    cancelCommission,
    acceptCommission,
    rejectCommission,
    completeCommission,
    mintCommission,
  }
}
