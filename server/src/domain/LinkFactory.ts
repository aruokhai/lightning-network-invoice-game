import { Link } from "./Link";
import { IMessageSigner } from "./IMessageSigner";
import { Invoice } from "./Invoice";
import { link } from "fs";

export class LinkFactory {
    constructor(readonly signer: IMessageSigner) {}

    /**
     * Creates the first Link from some arbitrary 32-byte (64 hex) seed.
     * @param seed
     * @param startSats
     * @returns
     */
    public async createFromSeed(seed: string, startSats: number): Promise<Link> {
        const signedMessage = await this.signer.sign(seed);
        return new Link(seed, signedMessage, startSats)

    }

    /**
     * Creates a new link from a settled link. This method will construct
     * a new link by
     *
     * 1. Signing the preimage of the settled invoice of the settled link
     * 2. Setting the minSats to +1 over the settled invoice value
     * 3. Constructing the Link object
     * @param settled
     * @returns
     */
    public async createFromSettled(settled: Link): Promise<Link> {
        const signature  = await this.signer.sign(settled.invoice.preimage);
        const newAmount  = Number(settled.invoice.valueSat) + 1;
        return new Link(settled.invoice.preimage, signature, newAmount)
    }
}
