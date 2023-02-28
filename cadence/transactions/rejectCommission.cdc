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