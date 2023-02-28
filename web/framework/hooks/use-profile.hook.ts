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

export default function useProfile() {
  const [allProfiles, setAllProfiles] = useState()

  useEffect(() => {
    getAllProfiles()
  }, [])

  const createCreator = async (
    name: string,
    avatar: string,
    handleThankYouModalOpen: () => void,
  ) => {
    const id = toast.loading("Initializing...")

    try {
      const res = await send([
        transaction(`
        import FungibleToken from 0xFungibleToken
        import NonFungibleToken from 0xNonFungibleToken
        import FUSD from 0xFUSD
        import FiatToken from 0xFiatToken
        import FlowToken from 0xFlowToken
        import MetadataViews from 0xMetadataViews
        import FIND from 0xFIND
        import Profile from 0xProfile
        import CreatorProfile from 0xCreatorProfile
        
                transaction(name: String, avatar: String) {
        
                  prepare(account: AuthAccount) {
                    //if we do not have a profile it might be stored under a different address so we will just remove it
                    let profileCapFirst = account.getCapability<&{Profile.Public}>(Profile.publicPath)
                    if profileCapFirst.check() {
                      return 
                    }
        
                    let fusdReceiver = account.getCapability<&{FungibleToken.Receiver}>(/public/fusdReceiver)
                    if !fusdReceiver.check() {
                      let fusd <- FUSD.createEmptyVault()
                      account.save(<- fusd, to: /storage/fusdVault)
                      account.link<&FUSD.Vault{FungibleToken.Receiver}>( /public/fusdReceiver, target: /storage/fusdVault)
                      account.link<&FUSD.Vault{FungibleToken.Balance}>( /public/fusdBalance, target: /storage/fusdVault)
                    }
        
                    let usdcCap = account.getCapability<&FiatToken.Vault{FungibleToken.Receiver}>(FiatToken.VaultReceiverPubPath)
                    if !usdcCap.check() {
                        account.save( <-FiatToken.createEmptyVault(), to: FiatToken.VaultStoragePath)
                        account.link<&FiatToken.Vault{FungibleToken.Receiver}>( FiatToken.VaultReceiverPubPath, target: FiatToken.VaultStoragePath)
                        account.link<&FiatToken.Vault{FiatToken.ResourceId}>( FiatToken.VaultUUIDPubPath, target: FiatToken.VaultStoragePath)
                        account.link<&FiatToken.Vault{FungibleToken.Balance}>( FiatToken.VaultBalancePubPath, target:FiatToken.VaultStoragePath)
                    }
                    // Create Profile
                    var created=false
                    var updated=false
                    let profileCap = account.getCapability<&{Profile.Public}>(Profile.publicPath)
                    if !profileCap.check() {
                      let profile <-Profile.createUser(name:name, createdAt: "Basic Beasts")
                      account.save(<-profile, to: Profile.storagePath)
                      account.link<&Profile.User{Profile.Public}>(Profile.publicPath, target: Profile.storagePath)
                      account.link<&{FungibleToken.Receiver}>(Profile.publicReceiverPath, target: Profile.storagePath)
                      created=true
                    }
        
                    let profile=account.borrow<&Profile.User>(from: Profile.storagePath)!
        
                    if !profile.hasWallet("Flow") {
                      let flowWallet=Profile.Wallet( name:"Flow", receiver:account.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver), balance:account.getCapability<&{FungibleToken.Balance}>(/public/flowTokenBalance), accept: Type<@FlowToken.Vault>(), tags: ["flow"])
                  
                      profile.addWallet(flowWallet)
                      updated=true
                    }
                    if !profile.hasWallet("FUSD") {
                      profile.addWallet(Profile.Wallet( name:"FUSD", receiver:fusdReceiver, balance:account.getCapability<&{FungibleToken.Balance}>(/public/fusdBalance), accept: Type<@FUSD.Vault>(), tags: ["fusd", "stablecoin"]))
                      updated=true
                    }
        
                    if !profile.hasWallet("USDC") {
                      profile.addWallet(Profile.Wallet( name:"USDC", receiver:usdcCap, balance:account.getCapability<&{FungibleToken.Balance}>(FiatToken.VaultBalancePubPath), accept: Type<@FiatToken.Vault>(), tags: ["usdc", "stablecoin"]))
                      updated=true
                    }
        
                    //If find name not set and we have a profile set it.
                    if profile.getFindName() == "" {
                      if let findName = FIND.reverseLookup(account.address) {
                        profile.setFindName(findName)
                        // If name is set, it will emit Updated Event, there is no need to emit another update event below. 
                        updated=false
                      }
                    }
        
                    if created {
                      profile.emitCreatedEvent()
                    } else if updated {
                      profile.emitUpdatedEvent()
                    }
        
                    profile.setAvatar(avatar)
        
                    //Create CreatorManager
                    if account.borrow<&CreatorProfile.CreatorManager>(from: CreatorProfile.CreatorManagerStoragePath) == nil {
                        account.save(<- CreatorProfile.createCreatorManager(), to: CreatorProfile.CreatorManagerStoragePath)
                    }
                    let creatorManager = account.borrow<&CreatorProfile.CreatorManager>(from: CreatorProfile.CreatorManagerStoragePath)!
                    
                    // Register creator
                    CreatorProfile.registerCreator(creatorManager: creatorManager)
        
                  }
                  
                }`),
        args([arg(name, t.String), arg(avatar, t.String)]),
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
      getAllProfiles()
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

  const getAllProfiles = async () => {
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
      setAllProfiles(res)
    } catch (err) {
      console.log(err)
    }
  }

  return {
    createCreator,
    getAllProfiles,
    allProfiles,
  }
}
