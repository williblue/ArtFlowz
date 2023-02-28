import Profile from 0xProfile
import CreatorProfile from "./../../../cadence/contracts/CreatorProfile.cdc"

pub fun main() : [Profile.UserProfile] {
    var profiles: [Profile.UserProfile] = []
    let addresses = CreatorProfile.getAllCreators()
    for address in addresses {
        let user = getAccount(address)
            .getCapability<&{Profile.Public}>(Profile.publicPath)
            .borrow()?.asProfile()
        if (user != nil) {
            profiles.append(user!)
        }
    }
    return profiles
}