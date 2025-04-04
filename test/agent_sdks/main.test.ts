import * as dotenv from "dotenv";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { CaishenSDK, createAgentTools } from "../../src";
import ChainIds from "../../src/constants/chain-ids";

dotenv.config();

async function testCaishenSDK() {
  console.log("Starting chat mode... Type 'exit' to end.");
  console.log("project_key: ", process.env.PROJECT_KEY)
  const sdk = new CaishenSDK({
		projectKey: process.env.PROJECT_KEY || '',
	});
  const agent_id = "9327dabd-84d2-4bbd-b94c-8be3c016ea91"
  const agent_token = await sdk.connectAsAgent({
    agentId: agent_id
  })
  console.log("agent_token: ", agent_token)
  // const allChains = await sdk.crypto.getSupportedChainTypes()
  // console.log("supportedChains : ", allChains)
  // const wallet = await sdk.crypto.getWallet(
  //   {
  //     chainType: 'ETHEREUM',
  //     account: 1,
  //   }
  // )
  // console.log("wallet : ", wallet)
  // const balance = await sdk.crypto.getBalance({
  // wallet: {
  //   chainType: "ETHEREUM",
  //   account: 1,
  //   chainId: ChainIds.SMART_CHAIN
  // },
  //   payload: { token: null }
  // })
  // console.log("balance: ", balance)
  const tools = createAgentTools(sdk)
  console.log("tools : ", tools)
}

testCaishenSDK().catch(console.error);