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