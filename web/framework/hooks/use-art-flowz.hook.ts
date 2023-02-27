import { useEffect, useReducer, useState } from "react"
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
  useEffect(() => {}, [])

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
                let vaultRefCapability = acct.getCapability<&FiatToken.Vault{FungibleToken.Provider, FungibleToken.Balance}>(/private/FiatTokenArtFlowz)
                
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
  return { createCommission }
}
