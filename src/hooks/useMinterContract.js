import { useContract } from "./useContract";
import MyNFTAbi from "../contracts/MyNFT.json";
import MyNFTContractAddress from "../contracts/MyNFTAddress.json";

export const useMinterContract = () =>
    useContract(MyNFTAbi.abi, MyNFTContractAddress.MyNFT);