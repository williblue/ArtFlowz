import ArtFlowz from 0xArtFlowz
import ArtPiece from 0xArtPiece
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews

transaction(id: UInt64, name: String, description: String, image: String) {

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