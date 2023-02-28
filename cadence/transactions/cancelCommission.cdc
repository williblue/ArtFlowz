import ArtFlowz from 0xArtFlowz

transaction(id: UInt64) {

    prepare(acct: AuthAccount) {

        //Get Commission Collection
        let commissionCollectionRef = acct.borrow<&ArtFlowz.CommissionCollection>(from: ArtFlowz.CollectionStoragePath)??
                                                                        panic("Can't get commission collection!")

        commissionCollectionRef.cancelCommission(id: id)
    }

}