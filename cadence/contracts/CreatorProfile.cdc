// Purpose:
// validate creator address using CreatorManager
// register creator
// show list of available creators

pub contract CreatorProfile {

    pub let CreatorManagerStoragePath: StoragePath
    pub let CreatorManagerPrivatePath: PrivatePath
    
    access(self) var creators: [Address]

    pub resource CreatorManager {}

    pub fun registerCreator(creatorManager: &CreatorProfile.CreatorManager) {
        // Add Creator to list
        if(!self.creators.contains(creatorManager.owner!.address)) {
            self.creators.append(creatorManager.owner!.address)
        }
    }

    pub fun createCreatorManager(): @CreatorProfile.CreatorManager {
        return <- create self.CreatorManager()
    }

    pub fun getAllCreators(): [Address] {
        return self.creators
    }

    init() {
        self.CreatorManagerStoragePath = /storage/CreatorProfileCreatorManager
        self.CreatorManagerPrivatePath = /private/CreatorProfileCreatorManager

        self.creators = []
    }

}