import ArtFlowz from "./../../../cadence/contracts/ArtFlowz.cdc"
import FungibleToken from "./../../../cadence/contracts/FungibleToken.cdc"
import FiatToken from "./../../../cadence/contracts/FiatToken.cdc"

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