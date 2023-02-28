import ArtFlowz from 0xArtFlowz

pub fun main(address: Address): [AnyStruct] {
    var commissions:[AnyStruct]  = []

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

    return commissions
}