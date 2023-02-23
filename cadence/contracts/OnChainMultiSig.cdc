pub resource MinterController: ResourceId, OnChainMultiSig.PublicSigner  {
    access(self) let multiSigManager: @OnChainMultiSig.Manager
    pub fun UUID(): UInt64 {
        return self.uuid
    }
    pub fun configureMinterAllowance(allowance: UFix64) {
        let managedMinter = FiatToken.managedMinters[self.uuid] ?? panic("MinterController does not manage any minters")
        FiatToken.minterAllowances[managedMinter] = allowance
        emit MinterConfigured(controller: self.uuid, minter: managedMinter, allowance: allowance)
    }
    pub fun increaseMinterAllowance(increment: UFix64) {
        let managedMinter = FiatToken.managedMinters[self.uuid] ?? panic("MinterController does not manage any minters")
        let allowance = FiatToken.minterAllowances[managedMinter] ?? 0.0
        let newAllowance = allowance.saturatingAdd(increment)
        self.configureMinterAllowance(allowance: newAllowance)
    }
    pub fun decreaseMinterAllowance(decrement: UFix64) {
        let managedMinter = FiatToken.managedMinters[self.uuid] ?? panic("MinterController does not manage any minters")
        let allowance = FiatToken.minterAllowances[managedMinter] ?? panic("Cannot decrease nil MinterAllowance")
        let newAllowance = allowance!.saturatingSubtract(decrement)
        self.configureMinterAllowance(allowance: newAllowance)
    }
    pub fun removeMinter() {
        let managedMinter = FiatToken.managedMinters[self.uuid] ?? panic("MinterController does not manage any minters")
        assert(FiatToken.minterAllowances.containsKey(managedMinter), message: "cannot remove unknown Minter")
        FiatToken.minterAllowances.remove(key: managedMinter)
        emit MinterRemoved(controller: self.uuid, minter: managedMinter)
    }
    // ------- OnChainMultiSig.PublicSigner interfaces -------
    pub fun addNewPayload(payload: @OnChainMultiSig.PayloadDetails, publicKey: String, sig: [UInt8]) {
        self.multiSigManager.addNewPayload(resourceId: self.uuid, payload: <-payload, publicKey: publicKey, sig: sig)
    }
    pub fun addPayloadSignature (txIndex: UInt64, publicKey: String, sig: [UInt8]) {
        self.multiSigManager.addPayloadSignature(resourceId: self.uuid, txIndex: txIndex, publicKey: publicKey, sig: sig)
    }
    pub fun executeTx(txIndex: UInt64): @AnyResource? {
        let p <- self.multiSigManager.readyForExecution(txIndex: txIndex) ?? panic ("no ready transaction payload at given txIndex")
        switch p.method {
            case "configureKey":
                let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                let weight = p.getArg(i: 1)! as? UFix64 ?? panic ("cannot downcast weight")
                let sa = p.getArg(i: 2)! as? UInt8 ?? panic ("cannot downcast sig algo")
                self.multiSigManager.configureKeys(pks: [pubKey], kws: [weight], sa: [sa])
            case "removeKey":
                let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                self.multiSigManager.removeKeys(pks: [pubKey])
            case "configureMinterAllowance":
                let allowance = p.getArg(i: 0)! as? UFix64 ?? panic ("cannot downcast allowance amount")
                self.configureMinterAllowance(allowance: allowance)
            case "increaseMinterAllowance":
                let increment = p.getArg(i: 0)! as? UFix64 ?? panic ("cannot downcast increment amount")
                self.increaseMinterAllowance(increment: increment)
            case "decreaseMinterAllowance":
                let decrement = p.getArg(i: 0)! as? UFix64 ?? panic ("cannot downcast decrement amount")
                self.decreaseMinterAllowance(decrement: decrement)
            case "removeMinter":
                self.removeMinter()
            default:
                panic("Unknown transaction method")
        }
        destroy (p)
        return nil
    }
    pub fun getTxIndex(): UInt64 {
        return self.multiSigManager.txIndex
    }
    pub fun getSignerKeys(): [String] {
        return self.multiSigManager.getSignerKeys()
    }
    pub fun getSignerKeyAttr(publicKey: String): OnChainMultiSig.PubKeyAttr? {
        return self.multiSigManager.getSignerKeyAttr(publicKey: publicKey)
    }
    destroy() {
        destroy self.multiSigManager
    }
    init(pk: [String], pka: [OnChainMultiSig.PubKeyAttr]) {
        self.multiSigManager <-  OnChainMultiSig.createMultiSigManager(publicKeys: pk, pubKeyAttrs: pka)
    }
}