import { chainlinkPriceFeedByChainIdAndAddress } from '$/sources/ChainlinkDataFeeds/AddressCatalog/constants.ts'


const chainlinkEthUsdFeed = chainlinkPriceFeedByChainIdAndAddress[
	'1:0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'
]

if (chainlinkEthUsdFeed == null)
	throw new Error('Canonical Chainlink Ethereum ETH/USD feed is missing')


/**
	* Canonical, source-backed identities shared by resolver probes, generated route
	* discovery, and the representative screenshot corpus. Consumer-specific paths
	* and assertions deliberately remain with those consumers.
	*/
export const representativeIdentityFixtures = {
	evm: {
		vitalikAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
		usdcAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		erc4337SmartAccountAddress: '0x0000000000001d8a2e7bf6bc369525a2654aa298',
		erc4337BundlerAddress: '0xf0ac778fb2e56bab4edd7f25c2ed2f333d165b8d',
		erc4337PaymasterAddress: '0x6599bba2a055f3c769cba1a2d462a75429bd7bf7',
		erc4337AccountFactoryAddress: '0xcad776fce9c3b3db6724aeb4c7fa2f5f3c088253',
		userOperationHash: '0xca87534346367dbf4ff6675627a3e43635db5a36bd8ef99ffcd20a63d1555ef5',
		eip7702TransactionHash: '0x6e221c6381bb5432b2c2eb33b57a9ef980ca6cc4526770590b4a951104bfa27b',
		eip7702AuthorizationIndex: 0,
		tokenApprovalTransactionHash: '0xc6eb72b1c363758df0bfdaea6b7f1dad12018ff1068fbf7b97da765ffb8779a8',
		tokenApprovalLogIndex: 11,
		stateChangeKey: 'coin-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
	},
	farcaster: {
		castHash: '0xe4f2e1c70d72388a98dba2a2511a9b480840e544',
		channelParentUrl: 'chain://eip155:1/erc721:0x7dd4e31f1530ac682c8ea4d8016e95773e08d8b0',
	},
	lens: {
		feedAddress: '0xa1e39b173a7584a75330174ea194e864347e424a',
		feedRuleId: 'eyJjb25maWdfc2FsdCI6IjB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMiIsInJ1bGVfYWRkcmVzcyI6IjB4NDBhMmEzNTI1ODNiMjY2MDk3MjM0ZjEyNjBiNWFhZmI3YjEyOTA0NyJ9',
		usernameId: '970704',
		usernameLocalName: 'forexai',
		namespaceAddress: '0x772c653b2383455fefbb15e7c283b2ff61c63e57',
		namespaceRuleId: 'eyJjb25maWdfc2FsdCI6IjB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMyIsInJ1bGVfYWRkcmVzcyI6IjB4YjU0MTA1NTIyMmM4N2VlODZhNzI1NThlOGI1ODJhOWMwMTU4YTBkOCJ9',
	},
	chainlink: {
		ethUsdFeed: {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: `${chainlinkEthUsdFeed.chainId}`,
				},
			},
			address: chainlinkEthUsdFeed.proxyAddress,
		},
		ethUsdRoundId: 129_127_208_515_966_894_633n,
	},
	celestia: {
		network: { $network: { slug: 'celestia' } },
		headTimestampMs: 1_788_559_705_631,
		blockHeight: 13_752_118n,
		blockHash: '22989eeeb40baae8eb38e942172a22006cf8fdafd37150d6d1be2af959af18d9',
		namespaceId: '0000000000000000000000000000000000000076666f72676500000000',
		namespaceTimestampMs: 1_785_908_348_613,
		blobNamespaceId: '000000000000000000000000000000000000003a85be721883eab074bf',
		blobHeight: 13_752_119n,
		blobCommitment: 'j8mjhc5784RVvPiCsTrAoiCPOg0rnDoueQsCHa6VE+s=',
	},
	cosmosHubIbc: {
		network: {
			caip2: {
				namespace: 'cosmos',
				reference: 'cosmoshub-4',
			},
		},
		blockHeight: 32_823_347n,
		blockHash: '598DCFEB82141994C401E993B09723B0F8FA83F3DD0F407D0B46DBF5261089E2',
		portId: 'transfer',
		channelId: 'channel-0',
		packetSequence: 1n,
		packetDirection: 'source',
		connectionId: 'connection-5',
		clientId: '07-tendermint-5',
		traceKey: 'trace:transfer/channel-0/uatom',
	},
	curve: {
		network: {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		},
		poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
		poolCoinAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
		gaugeAddress: '0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a',
		lendingVaultAddress: '0x8cf1de26729cfb7137af1a6b2a665e099ec319b5',
	},
	compound: {
		network: {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		},
		cometAddress: '0xc3d688b66703497daa19211eedff47f25384cdc3',
		collateralSymbol: 'WETH',
	},
	circleCctp: {
		allowanceToken: 'USDC',
		sourceDomain: {
			cctpVersion: 2,
			domainId: 0,
		},
		destinationDomain: {
			cctpVersion: 2,
			domainId: 6,
		},
		burnFeeTimestampMs: 1_788_567_541_480,
		solanaDomain: {
			cctpVersion: 2,
			domainId: 5,
		},
		stellarDomain: {
			cctpVersion: 2,
			domainId: 27,
		},
	},
	filfox: {
		// Cross-checked against the configured GLIF Lotus endpoint with
		// Filecoin.StateMarketStorageDeal at the current head.
		network: {
			caip2: {
				namespace: 'fil',
				reference: 'f',
			},
		},
		messageCid: 'bafy2bzaced73remwmehw3ns5p2hcaqouzgn2glu6b3ijlo4cs4xda7qpqot6o',
		messageHeight: 6_342_004n,
		messageTipsetKey: 'bafy2bzacedrr2f35qnyakavyyouyii6dkky2agzpnf55js5wh4yulbrt5m6km,bafy2bzaceaad3knybi6fayho66n3i4reoiiamy5wyk6sex2nwvb2imncdbydg',
		dealId: 133_977_726n,
	},
	dydx: {
		network: {
			$network: {
				caip2: {
					namespace: 'cosmos',
					reference: 'dydx-mainnet-1',
				},
			},
		},
		marketTicker: 'BTC-USD',
	},
	algorand: {
		network: { $network: { slug: 'algorand' } },
		accountAddress: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
		assetId: 5n,
		applicationId: 60_553_466n,
		transactionId: '7MK6WLKFBPC323ATSEKNEKUTQZ23TCCM75SJNSFAHEM65GYJ5ANQ',
		round: 64_733_565n,
		proofTransactionId: 'ITSPM2FFCGCNBPQUEWBK5IGFWEEPTIZC3BDU5HIWS575CUFH6OUA',
		proofRound: 64_739_000n,
		transactionGroup: '0x35dd1589f92da2e464db49979c5da80a7712dbbb6cdd4bea95b59c98ea39f06b',
	},
	arweave: {
		network: { $network: { slug: 'arweave' } },
		blockHeight: 1_994_309n,
		blockIndepHash: 'X9fj5emVge2OPLb4Gu9XdtCQVvSlcXToygdVGW0-hxBJYItZw8Hf7utyNYMpPDHj',
		manifestTransactionId: 'nRjadfC8nNqyQNDMVubUyGZYmHRVxKmCZwOstgDf_1g',
		manifestPath: 'token.json',
	},
	aptosMove: {
		network: {
			caip2: {
				namespace: 'aptos',
				reference: '1',
			},
		},
		moduleAddress: '0x1',
		moduleName: 'coin',
		functionName: 'transfer',
		structName: 'Coin',
	},
	gitlab: {
		projectMirror: {
			forgeHost: 'gitlab.com',
			owner: 'gitlab-org',
			repositoryName: 'gitlab',
		},
		projectRepository: {
			canonicalRemoteUrl: 'https://gitlab.com/gitlab-org/gitlab.git',
		},
		pipelineId: 2_821_815_848,
		jobId: 16_319_415_986,
		issueNumber: 627_806,
		pullRequestNumber: 253_788,
		protectedBranchName: 'master',
		compareFromObjectId: '0x346d3c57ccfb18d3ce413fdedf7e8bbc03e913dd',
		compareToObjectId: '0x38b1f5973f1da60a765815acc819c36c7c36e308',
		compareFilePath: 'doc/auth/tokens/fine_grained_access_tokens_rest.md',
		signatureId: 'https://gitlab.com/gitlab-org/gitlab/-/commit/38b1f5973f1da60a765815acc819c36c7c36e308#signature',
	},
	gmx: {
		network: {
			caip2: {
				namespace: 'eip155',
				reference: '42161',
			},
		},
		marketTokenAddress: '0x70d95587d40a2caf56bd97485ab3eec10bee6336',
	},
	kaspaExplorer: {
		network: { $network: { slug: 'kaspa' } },
		address: 'kaspa:qzd6sfx3a8gx3q0qjvsts0pc4gj62z8a4kdf6qcndq5fg42wwxpv6sv9ngmg9',
		transactionId: 'a249926881cda5f3199bf1cd3662cc6f2c3c0c713df1f9c069ff95533b48562c',
		acceptingBlockHash: '22331055f6af40fd0a51df2da53f92742b88917b18a6b08acffbd5a1bcb9e945',
	},
	hedera: {
		network: { slug: 'hedera' },
		mainnetNodeZero: {
			$network: { slug: 'hedera' },
			nodeId: 0,
		},
		networkSupplyTimestampMs: 1_788_555_672_125,
		networkStakeTimestampMs: 1_788_480_000_000,
		networkExchangeRateTimestampMs: 1_788_555_657_809,
		networkFeeTimestampMs: 1_787_968_800_828,
		networkFeeTransactionType: 'ContractCall',
		scheduleId: '0.0.10841252',
		scheduleTimestampMs: 1_788_504_351_159,
		contractId: '0.0.10841491',
		contractResultTransactionId: '0.0.995584-1788565540-759489405',
		contractResultNonce: 0,
		topicId: '0.0.10614381',
		topicTimestampMs: 1_783_014_166_347,
		topicMessageSequenceNumber: 1n,
		tokenId: '0.0.10843512',
		tokenTimestampMs: 1_788_553_770_801,
		nftSerialNumber: 50n,
		nftTimestampMs: 1_788_553_795_559,
		tokenTreasuryAccountId: '0.0.10835800',
	},
	internetComputer: {
		network: { $network: { slug: 'icp' } },
		ledgerCanisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
		blockIndex: 9_840_566n,
		transactionIndex: 0,
	},
	morpho: {
		network: {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		},
		marketId: '0x8eaf7b29f02ba8d8c1d7aeb587403dcb16e2e943e4e2f5f94b0963c2386406c9',
		vaultAddress: '0x55555815a5595991c3a0ff119b59aef6c8b55555',
	},
	pendle: {
		network: {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		},
		marketAddress: '0x00b321d89a8c36b3929f20b7955080baed706d1b',
	},
	polkadotAssetHub: {
		network: {
			caip2: {
				namespace: 'polkadot',
				reference: '91b171bb158e2d3848fa23a9f1c25182',
			},
		},
		usdtAssetId: '1984',
	},
	pythBenchmarks: {
		btcUsdFeedId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
		channel: 'Stable',
	},
	euler: {
		network: {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		},
		vaultAddress: '0x0120c2748545a4d9c875cddfb439f786d6f1b460',
		vaultBlockNumber: 25_908_000n,
	},
	aave: {
		network: {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		},
		poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
		underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
	},
	across: {
		transferId: '1/96199338764656550835350133836123636363765925071210340339950952241246175890130',
		fillTimestampMs: 1_775_059_863_000,
	},
	axelar: {
		network: {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		},
		sourceTransactionHash: '0x4130dcf3e503e416f64759fe66d2d8d37fb3cf9d27c9a4873356afb0cd13eb1c',
		logIndex: 4,
		transferId: '0x4130dcf3e503e416f64759fe66d2d8d37fb3cf9d27c9a4873356afb0cd13eb1c-4',
		executedTimestampMs: 1_788_561_685_000,
	},
	layerZero: {
		transferId: '0x8d19d07e80265c0d6705669e004398ffed24002335cf8000d1d52aa847308dc1',
		deliveredTimestampMs: 1_788_571_101_000,
	},
	lifi: {
		transferId: '0x5e9bd1e1232bcfb28e660ce116fe910aa058345604334e5f560034f51ef5327c',
		completedTimestampMs: 1_729_164_251_000,
	},
	wormhole: {
		emitterChain: 1,
		emitter: '19671a08a9cef6f3a04314ed478fc332a4966f41ad3e6fea76933dede9c6cdfe',
		sequence: '570128',
		transferId: '1/19671a08a9cef6f3a04314ed478fc332a4966f41ad3e6fea76933dede9c6cdfe/570128',
		sourceTimestampMs: 1_788_564_985_000,
	},
	acpRegistry: {
		networkId: 'acp-registry',
		agentId: 'codex-acp',
		packageName: '@agentclientprotocol/codex-acp@1.10.0',
		repositoryUrl: 'https://github.com/agentclientprotocol/codex-acp',
	},
	atproto: {
		feedGeneratorUri: 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot',
		graphListUri: 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.graph.list/3lvpca43j5z26',
		starterPackUri: 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.graph.starterpack/3msbk2l6geo2r',
	},
	mcpRegistry: {
		serverName: 'ac.inference.sh/mcp',
		version: '2.0.1',
	},
	ociRegistry: {
		registry: 'quay.io',
		repository: 'prometheus/prometheus',
		reference: 'latest',
		descriptorKind: 'manifest',
		descriptorIndex: 0,
	},
	localSourceEndpoint: {
		bindingId: '["Local_Internal","Global","internal-catalog","BrowserDirect","CatalogRows"]',
		endpointIndex: 0,
	},
	eas: {
		network: {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		},
		attestationUid: '0xeb5433bc347dc94574cb5eeff007bf6427c12e48f7ff1a9927ce92cf60bf522a',
		schemaUid: '0xa76299ae6a66b66ff48344f36c0fa657a0a9eeb6721248311df9cf25748e4405',
		attestationTimestampMs: 1_788_554_357_000,
	},
	eip8004: {
		registration: {
			namespace: 'eip155',
			chainId: 196,
			identityRegistry: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
			agentId: '12662',
		},
		fileUrl: 'https://static.okx.com/cdn/web3/wallet/marketplace/headimages/agent/card/bd1567fc-b93b-40e8-aae3-ed2c12fba50e.json',
	},
	mempoolSpace: {
		miningPoolSlug: 'f2pool',
	},
	avalanche: {
		pChainNetwork: { slug: 'avalanche-p-chain' },
		cChainBlockchainId: '2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5',
		primarySubnetId: '11111111111111111111111111111111LpoYY',
		pChainBlockHeight: 1n,
		pChainBlockId: '4AqeFPxtTW4B5D6oR8gRZTvRKnnqkUWiV6mUNZxjUMbQKYWpi',
		pChainTransactionId: 'N3MsLv3aEmeQ9Z82m6JjrmMV884RCM88Xc3y97wv6NXPpvoSK',
		validatorNodeId: 'NodeID-6QD1KNQkx6wj142Tv6demd3FYbghQvCM2',
		validatorStartTimeMs: 1_788_460_595_000,
		delegatorTransactionId: '2mm6pPEBuSaSx9g6wJMveRd5sT7bdgEGsYkStDMgp8GTYu1HpS',
	},
	bitcoinOrdinals: {
		network: { $network: { slug: 'bitcoin' } },
		genesisInscriptionId: '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
		runestoneTransactionId: '9327998a4aee68a6792db8b00540976ebf81b32ef3c0fd52a43d4ce1e3c5cf11',
		runestoneOutputIndex: 2,
	},
	ubuntuTorrent: {
		infoHash: '62a4d9e139f3315f8716bcccca0cc984a9809da1',
		hashVersion: 'v1',
		magnetUri: 'magnet:?xt=urn%3Abtih%3A62a4d9e139f3315f8716bcccca0cc984a9809da1&dn=ubuntu-24.04.4-live-server-amd64.iso',
	},
	hyperliquid: {
		network: { slug: 'hyperliquid' },
		spotPairIndex: 0,
		marketKey: 'BTC',
		candleTimeInterval: {
			unit: 'h',
			value: 1,
		},
		candleTimestampMs: 1_788_480_000_000,
		borrowLendReserveTokenIndex: 0,
	},
	ton: {
		network: {
			caip2: {
				namespace: 'ton',
				reference: '-239',
			},
		},
		electorAddress: '-1:3333333333333333333333333333333333333333333333333333333333333333',
		transactionLt: 101_384_778_000_002n,
		transactionHash: '6b308756f498049433fa2d98cbd110d279c814874945502db83391882c43fe88',
		blockWorkchain: -1,
		blockShardPrefix: '8000000000000000',
		blockSeqno: 90_661_059n,
		blockRootHash: 'c23559a12362989f8324e37e6500b12e8dc8d7b97497932b9e95dee0d3ed2067',
		blockFileHash: 'e726f7aa3ba57dc23762a5efa51da98fe6e154945fa658bf9630727e33e5d037',
		electorGetMethod: 'active_election_id',
	},
	stellar: {
		network: { $network: { slug: 'stellar' } },
		ledgerSequence: 64_275_592n,
		transactionHash: '48c9257418720bf4f4d73e44d531107f52a51cca7c85c9507139ad9f17f10275',
		effectId: '0276061565571067905-0000000001',
		accountId: 'GDL6SNT7Z34F35XKK2JOKTHFGYJKMUKFTO4CBSIFHM24HKKUSC6V2B2T',
		assetKey: 'XRP-GBXRPL45NPHCVMFFAYZVUVFFVKSIZ362ZXFP7I2ETNQ3QKZMFLPRDTD5',
		liquidityPoolId: 'ffffe478b19c0d27c19fecdf36b6b60fefc563e1806109a58b86b4138abd085a',
		liquidityPoolTimestampMs: 1_788_534_511_000,
		offerId: '1856111993',
		offerTimestampMs: 1_788_558_159_000,
		claimableBalanceId: '00000000f261aea32568691a38a1922e62ee7babf079565b3d37b3004d80080d48bdd191',
		claimableBalanceTimestampMs: 1_788_558_159_000,
		signerKey: 'GDL6SNT7Z34F35XKK2JOKTHFGYJKMUKFTO4CBSIFHM24HKKUSC6V2B2T',
		signerType: 'ed25519_public_key',
	},
	starknet: {
		network: {
			$network: {
				caip2: {
					namespace: 'starknet',
					reference: 'SN_MAIN',
				},
			},
		},
		blockNumber: 14_379_799n,
		blockHash: '0x1c55eb6bf86da02651d439f92c7d966c5fe7c5b6d7267d094dacabc0e7ec925',
		blockTimestampMs: 1_788_573_587_000,
		transactionHash: '0x2c29da1bf55a5f4cd3e6e8c9d94a0289ff8ac0d822ff6b435512d183e2aa667',
		strkContractAddress: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
		strkClassHash: '0x2e77ee61d4df3d988ee1f42ea5442e913862cc82c2584d212ecda76666498fc',
		storageKeyZero: '0x0',
	},
	snapshot: {
		spaceId: 'ens.eth',
		proposalId: '0x943e585d1a4996525c5c7d229401d604ea56fe08c2c9c615c44f048ba42487b7',
		voteId: '0x24b4538a489032cf6f100814d361131979026983d69ea0d7f1e3e803881c108d',
	},
	tezos: {
		network: { $network: { slug: 'tezos' } },
		headLevel: 14_805_148n,
		headHash: 'BL3YX2uoB5epTmFMxZF17DinjRgfsuZXMxyrm3kEFnx7mFtaVwQ',
		headTimestampMs: 1_788_591_016_000,
		bakerAddress: 'tz3RDC3Jdn4j15J7bBHZd29EUee9gVB1CxD9',
		bakerLevel: 11_240_282n,
		accountAddress: 'tz1c9aMAQDPGtQAtAvofjkC1FTBZEYaH6Wdi',
		accountLevel: 14_805_149n,
		contractAddress: 'KT1VwgAzxBMuxWdWdFCZoGAfSJ8YTtTq4UBV',
		contractLevel: 14_805_149n,
		tokenId: 3n,
		tokenLevel: 14_805_149n,
	},
	beacon: {
		blockRoot: '0x12acd030e5e2b03af12587808d5a797c0782c421b56eb3b976953b2df76012f4',
		slot: 15_145_036,
		validatorIndex: 830_776,
		validatorPubkey: '0x9738eff220e3355be1f432731e908896bb4ea91e100b3b1568a43563b2d4434825098159b21c10b5af5ff50ac8b422ba',
	},
	balancer: {
		network: {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		},
		poolId: '0x1ea5870f7c037930ce1d5d8d9317c670e89e13e3',
		poolEventId: '0x6ed38fd9a9e4525ca4203494fe2d174b83e0d1544d79e598f3eb81dd49b5d97c1e000000',
		aprTitle: 'Merkl Rewards',
		aprType: 'MERKL',
		tokenIndex: 0,
		gaugeAddress: '0x62a66eb9abf7a788f48d0ce7c0c065df9e09da19',
	},
	osmosis: {
		poolId: '1',
		poolAssetDenom: 'uosmo',
		positionId: '12',
		traceKey: 'trace:transfer/channel-144/gravity0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
		portId: 'transfer',
		channelId: 'channel-0',
		connectionId: 'connection-0',
		clientId: '07-tendermint-0',
	},
	sui: {
		network: { $network: { slug: 'sui' } },
		checkpointSequence: 318_800_406n,
		checkpointDigest: '44b86VspbjQF8A4XXwz5USW9hWBNWNf9DDYAVWk7KMJS',
		transactionDigest: '8AupcYSAsSoqa1ZbtsPjdfko7aLsRnbpJhBWKpLTr1WZ',
		transactionCheckpointSequence: 318_800_406n,
		accountAddress: '0x4440be690d52c31e71dc38d7f5a4b7f8fe98187658098101fb238d39745482fe',
		commandIndex: 0,
		eventIndex: 0,
		balanceChangeIndex: 0,
		objectChangeIndex: 0,
		objectId: '0x02c2d966cf9492923a3907bf9422786484fc626d9c2098cf862c0b90090c97be',
		objectVersion: 989_700_194n,
		objectDigest: 'DeXbnd5Qezn13L7zDcAU51HMLNhcBeQxT7egaNA925D4',
		packageId: '0x0000000000000000000000000000000000000000000000000000000000000002',
		packageVersion: 59n,
		packageDigest: '5X7bvB2bFiKVUn1f8nybKAwugEPtTcEaZujcdiPdicfE',
		coinType: '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
		moduleName: 'sui',
		functionName: 'transfer',
		structName: 'SUI',
	},
	xrpl: {
		network: { slug: 'xrpl' },
		ledgerIndex: 106_766_487n,
		ledgerHash: 'B523F26BD068FFFBA9D5A6ED7F7DFF124AF7001EC6BA86463C2A0580A75A8B31',
		ledgerEntryHash: '000001C00ADE73DFE88D818FE98D531B180463D51324BE4544EAC23D542EA6CE',
		transactionHash: '11379BC37180A11274C1E9F6A69F672A01461CF6A8C62421064C06CF66D9C450',
		trustlineAccount: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
		trustlineCurrency: 'USD',
		trustlineIssuer: 'rwdFmXzRpUC6DCcPedKSLaBZQyyCdnu72m',
		amendmentId: '8CC0774A3BF66D1D22E76BBDA8E8A232E6B6313834301B3B23E8601196AE6455',
		ammAccount: 'rs9ineLqrCzeAGS1bxsrW8x2n3bRJYAh3Q',
	},
	uniswapV3: {
		poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
		token0Address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		token1Address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		fee: 500,
		blockNumber: 18_000_000n,
		positionManagerAddress: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
		positionTokenId: 1n,
		positionBlockNumber: 25_908_000n,
	},
} as const
export const representativeIdentityProvenance = {
	ethereumEip7702Authorization: {
		owner: 'Ethereum public JSON-RPC',
		authority: 'https://ethereum.publicnode.com',
		canonicalInput: 'Transaction 0x6e221c63… in fixed block 25908000, containing one EIP-7702 authorization delegating to 0x7785a22f…, queried on 2026-09-04 local time',
	},
	ethereumTokenApproval: {
		owner: 'Ethereum public JSON-RPC',
		authority: 'https://ethereum.publicnode.com',
		canonicalInput: 'Exact receipt log 11 of transaction 0xc6eb72b1… in finalized block 25908017, carrying the canonical ERC Approval topic; Blockscout returned its exact WETH coin state change, queried on 2026-09-04 local time',
	},
	chainlinkEthUsdFeed: {
		owner: 'Chainlink Data Feeds address catalog',
		authority: 'https://docs.chain.link/data-feeds/price-feeds/addresses',
		canonicalInput: 'Official Ethereum ETH/USD proxy plus composite round 129127208515966894633, read through the configured public Ethereum RPC and reverified by exact getRoundData on 2026-09-04 local time',
	},
	farcasterDevChannel: {
		owner: 'Farcaster Client API',
		authority: 'https://api.farcaster.xyz/v2/all-channels',
		canonicalInput: 'The dev channel and its canonical chain parent URL queried on 2026-09-04; the configured public Snapchain hub also returned casts with this exact parent URL',
	},
	lensCurrentDirectory: {
		owner: 'Lens GraphQL API',
		authority: 'https://api.lens.xyz/graphql',
		canonicalInput: 'Exact feed and required rule, Firefly username namespace and required rule, and username 970704 queried by both ID and namespace/local-name on 2026-09-04',
	},
	celeniumMainnet: {
		owner: 'Celenium',
		authority: 'https://api.celenium.io/',
		canonicalInput: 'Current Celestia mainnet head, block, namespace, and blob resources queried on 2026-09-04',
	},
	cosmosHubIbc: {
		owner: 'Cosmos Hub public RPC and Cosmos Directory REST',
		authority: 'https://cosmos-rpc.publicnode.com/',
		canonicalInput: 'Cosmos Hub block 32823347/hash 598DCFEB… plus transfer/channel-0, packet commitment 1, linked connection-5 and client 07-tendermint-5 queried on 2026-09-04; trace key follows the resolver-owned ICS-20 path identity',
	},
	curveEthereum: {
		owner: 'Curve API',
		authority: 'https://api.curve.finance/',
		canonicalInput: 'Ethereum 3pool, its DAI reserve coin and gauge, plus current wstETH/crvUSD lending vault queried on 2026-09-04',
	},
	compoundEthereumUsdc: {
		owner: 'Compound III Comet repository',
		authority: 'https://github.com/compound-finance/comet/tree/f766f51583c23acc33b2a7824654ef2029a96804/deployments/mainnet/usdc',
		canonicalInput: 'Commit-pinned roots.json USDC Comet proxy 0xc3d688b6… and configuration.json WETH collateral entry queried on 2026-09-04',
	},
	circleCctpIris: {
		owner: 'Circle Iris API',
		authority: 'https://iris-api.circle.com/',
		canonicalInput: 'Current fast-burn USDC allowance clock and Ethereum-domain-0 to Base-domain-6 burn fee schedule queried on 2026-09-04',
	},
	filfoxMainnet: {
		owner: 'Filfox Filecoin explorer API',
		authority: 'https://filfox.info/',
		canonicalInput: 'Executed message with inclusion, receipt, fee, native transfers, six events, and two subcalls at height 6342004, plus storage deal 133977726 queried on 2026-09-04',
	},
	lotusGlifMainnet: {
		owner: 'GLIF Filecoin Lotus API',
		authority: 'https://api.node.glif.io/rpc/v1',
		canonicalInput: 'Storage deal 133977726 queried through Filecoin.StateMarketStorageDeal and message lookup signature reverified through Filecoin.StateSearchMsg on 2026-09-04',
	},
	dydxMainnet: {
		owner: 'dYdX Indexer',
		authority: 'https://indexer.dydx.trade/',
		canonicalInput: 'dYdX mainnet indexer height 104156331 and active BTC-USD perpetual market queried on 2026-09-04',
	},
	algorandNodelyMainnet: {
		owner: 'Nodely Algorand Indexer',
		authority: 'https://mainnet-idx.4160.nodely.dev/',
		canonicalInput: 'Mainnet account, asset, application, transaction, and current round resources, plus exact transaction proof at round 64739000 and two-row transaction group, queried through the configured Indexer and Algod endpoints on 2026-09-04',
	},
	avalanchePlatformVmMainnet: {
		owner: 'Avalanche public PlatformVM API',
		authority: 'https://api.avax.network/ext/bc/P',
		canonicalInput: 'P-Chain block height 1 and exact block ID, its committed transaction, and the longest-lived current primary-network validator with an embedded same-end-time delegator queried on 2026-09-04',
	},
	arweaveGatewayMainnet: {
		owner: 'Arweave public gateway',
		authority: 'https://arweave.net/',
		canonicalInput: 'Manifest transaction nRjadfC8nNqyQNDMVubUyGZYmHRVxKmCZwOstgDf_1g in block 1994309 and its declared token.json path queried through REST and GraphQL on 2026-09-04',
	},
	aptosFrameworkCoinModule: {
		owner: 'Aptos Labs fullnode',
		authority: 'https://fullnode.mainnet.aptoslabs.com/v1/',
		canonicalInput: 'Aptos framework 0x1::coin module ABI with public transfer entry function and Coin struct queried at ledger version 7086095666 on 2026-09-04',
	},
	gitlabProject: {
		owner: 'GitLab',
		authority: 'https://gitlab.com/gitlab-org/gitlab',
		canonicalInput: 'GitLab project canonical HTTPS clone URL, linked pipeline, issue, merge request, protected branch, and immutable MR base/head comparison queried on 2026-09-04',
	},
	gmxArbitrum: {
		owner: 'GMX API',
		authority: 'https://arbitrum.gmxapi.io/v1/',
		canonicalInput: 'Active Arbitrum ETH/USD WETH-USDC market token 0x70d95587… queried on 2026-09-04',
	},
	kaspaExplorerMainnet: {
		owner: 'Kaspa public Explorer API',
		authority: 'https://api.kaspa.org/',
		canonicalInput: 'Accepted transaction a2499268… with accepting chain block 22331055… and directly linked output address queried on 2026-09-04',
	},
	hederaMainnetNodeZero: {
		owner: 'Hedera Mirror Node REST API',
		authority: 'https://docs.hedera.com/api-reference/network/get-the-network-address-book-nodes',
		canonicalInput: 'GET /api/v1/network/nodes?limit=1&order=asc&node.id=eq:0 (account 0.0.3)',
	},
	hederaMirrorNodeMainnet: {
		owner: 'Hedera Mirror Node REST API',
		authority: 'https://mainnet-public.mirrornode.hedera.com/',
		canonicalInput: 'Current mainnet network, schedule, contract, contract result transaction, topic and first message, token, NFT, and treasury token relationship queried on 2026-09-04',
	},
	internetComputerRosettaMainnet: {
		owner: 'DFINITY Internet Computer developer documentation',
		authority: 'https://docs.internetcomputer.org/guides/digital-assets/rosetta/',
		canonicalInput: 'ICP ledger canister ryjl3-tyaaa-aaaaa-aaaba-cai and documented Rosetta mainnet block 9840566, whose ledger blocks contain exactly one transaction',
	},
	morphoEthereum: {
		owner: 'Morpho GraphQL API',
		authority: 'https://api.morpho.org/graphql',
		canonicalInput: 'Highest-supplied Ethereum Morpho market 0x8eaf7b29… and highest-assets Ethereum vault 0x55555815… queried on 2026-09-04',
	},
	pendleEthereum: {
		owner: 'Pendle V2 API',
		authority: 'https://api-v2.pendle.finance/core/v2/markets/all',
		canonicalInput: 'Ethereum USD0++/Usual market contract 0x00b321d8… returned with its complete market envelope on 2026-09-04',
	},
	polkadotAssetHubUsdt: {
		owner: 'Parity public Asset Hub Sidecar',
		authority: 'https://polkadot-asset-hub-public-sidecar.parity-chains.parity.io/pallets/assets/1984/asset-info',
		canonicalInput: 'Live Polkadot Asset Hub assets-pallet entry 1984 with symbol USDT and status Live, queried on 2026-09-04 local time',
	},
	pythBenchmarksBtcUsd: {
		owner: 'Pyth Benchmarks API',
		authority: 'https://benchmarks.pyth.network/v1/price_feeds/e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
		canonicalInput: 'Canonical Crypto.BTC/USD feed identity returned by the exact feed endpoint on 2026-09-04; publish-time observations remain provider-clock fixtures',
	},
	eulerEthereum: {
		owner: 'Euler Data API',
		authority: 'https://v3.euler.finance/',
		canonicalInput: 'Visible Ethereum EVK vault 0x0120c274… returned by the canonical vault catalog; ERC-4626 asset, totalAssets, and totalSupply calls reverified at fixed Ethereum block 25908000 on 2026-09-04 local time',
	},
	aaveEthereum: {
		owner: 'Aave V3 API',
		authority: 'https://api.v3.aave.com/graphql',
		canonicalInput: 'Canonical Ethereum V3 pool 0x87870bca… and its listed USDC reserve queried on 2026-09-04',
	},
	acrossDocumentedDeposit: {
		owner: 'Across API documentation',
		authority: 'https://docs.across.to/api-reference/deposit/get',
		canonicalInput: 'Documented Ethereum-to-Base deposit transaction 0x6cc666b8…; the Across API returned terminal filled transfer 1/9619933876… and immutable fill time 2026-04-01T16:11:03Z on 2026-09-04',
	},
	axelarscanExecutedMessage: {
		owner: 'Axelarscan GMP API',
		authority: 'https://api.axelarscan.io/gmp/searchGMP?txHash=0x4130dcf3e503e416f64759fe66d2d8d37fb3cf9d27c9a4873356afb0cd13eb1c&size=25',
		canonicalInput: 'Exact Ethereum-to-Immutable GMP source transaction returned one terminal executed/received message at explorer event index 4 with destination execution time 2026-09-04T22:41:25Z, queried on 2026-09-04 local time',
	},
	layerZeroDeliveredMessage: {
		owner: 'LayerZero Scan API',
		authority: 'https://scan.layerzero-api.com/v1/messages/guid/0x8d19d07e80265c0d6705669e004398ffed24002335cf8000d1d52aa847308dc1',
		canonicalInput: 'Terminal DELIVERED Tempo-to-Base message with source and destination transactions and final updated time 2026-09-05T01:18:21Z, queried on 2026-09-04 local time',
	},
	lifiDocumentedTransfer: {
		owner: 'LI.FI API documentation',
		authority: 'https://docs.li.fi/api-reference/check-the-status-of-a-cross-chain-transfer',
		canonicalInput: 'Documented terminal Arbitrum-to-Taiko transfer, reverified by source transaction hash and canonical transactionId on 2026-09-04; destination timestamp 1729164251 is the resolver observation clock',
	},
	wormholeSignedVaa: {
		owner: 'Wormholescan API',
		authority: 'https://api.wormholescan.io/api/v1/vaas/1/19671a08a9cef6f3a04314ed478fc332a4966f41ad3e6fea76933dede9c6cdfe/570128',
		canonicalInput: 'Signed Solana-origin VAA and matching operation 1/19671a08…/570128, with confirmed source timestamp 2026-09-04T23:36:25Z, queried on 2026-09-04 local time',
	},
	acpRegistryCodex: {
		owner: 'Agent Client Protocol registry',
		authority: 'https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json',
		canonicalInput: 'codex-acp entry, its @agentclientprotocol/codex-acp@1.10.0 package, and canonical repository queried on 2026-09-04',
	},
	atprotoBlueskyOfficial: {
		owner: 'Bluesky public AppView',
		authority: 'https://public.api.bsky.app/',
		canonicalInput: 'Official Bluesky Discover feed, Community Showcase list, and August 4 Elections starter pack queried on 2026-09-04',
	},
	mcpRegistryInference: {
		owner: 'Model Context Protocol Registry',
		authority: 'https://registry.modelcontextprotocol.io/v0.1/servers',
		canonicalInput: 'Latest ac.inference.sh/mcp package version 2.0.1 queried on 2026-09-04',
	},
	ociRegistryPrometheus: {
		owner: 'Quay OCI Distribution API',
		authority: 'https://quay.io/v2/prometheus/prometheus/manifests/latest',
		canonicalInput: 'Public multi-platform Prometheus latest manifest list and its first amd64 child descriptor queried on 2026-09-04',
	},
	localSourceEndpoint: {
		owner: 'Generated source binding catalog',
		authority: 'src/sources/Local/bindings.ts',
		canonicalInput: 'SourceBinding.sourceBindingId over the Local_Internal internal-catalog binding and endpoint index 0',
	},
	easEthereum: {
		owner: 'EAS Scan GraphQL',
		authority: 'https://easscan.org/graphql',
		canonicalInput: 'Ethereum attestation 0xeb5433bc…, its linked schema 0xa76299ae…, and immutable creation time queried on 2026-09-04',
	},
	eip8004DegenWatcher: {
		owner: '8004scan public API',
		authority: 'https://8004scan.io/api/v1/public/agents/196/12662',
		canonicalInput: 'Registration 196:0x8004a169…:12662 and its declared offchain metadata URI queried on 2026-09-04',
	},
	mempoolSpaceF2Pool: {
		owner: 'mempool.space API',
		authority: 'https://mempool.space/api/v1/mining/pools',
		canonicalInput: 'Canonical Bitcoin mining-pool catalog entry F2Pool/f2pool, unique id 36, queried on 2026-09-04',
	},
	avalanchePrimaryNetwork: {
		owner: 'Avalanche public P-Chain API',
		authority: 'https://api.avax.network/ext/bc/P',
		canonicalInput: 'Canonical C-Chain blockchain id and primary-network subnet id returned by platform.getBlockchains and platform.getSubnets on 2026-09-04',
	},
	bitcoinGenesisInscription: {
		owner: 'Ordinal Theory Handbook',
		authority: 'https://docs.ordinals.com/inscriptions/uris.html',
		canonicalInput: 'Documented genesis inscription 6fb976ab…442799i0; its immutable reveal transaction and ord image/png envelope were returned by both mempool.space and Blockstream Esplora on 2026-09-04',
	},
	bitcoinCookTheMempoolRunestone: {
		owner: 'ord reference index',
		authority: 'https://ordinals.com/rune/COOK%E2%80%A2THE%E2%80%A2MEMPOOL',
		canonicalInput: 'Documented etching transaction 9327998a…c5cf11; both mempool.space and Blockstream Esplora returned its immutable OP_RETURN OP_13 runestone at output 2 on 2026-09-04',
	},
	ubuntuNobleTorrent: {
		owner: 'Canonical Ubuntu releases',
		authority: 'https://releases.ubuntu.com/24.04/ubuntu-24.04.4-live-server-amd64.iso.torrent',
		canonicalInput: 'SHA-1 of the exact bencoded info dictionary from the official Ubuntu 24.04.4 server torrent, derived on 2026-09-04',
	},
	hyperliquidMainnet: {
		owner: 'Hyperliquid Info API',
		authority: 'https://api.hyperliquid.xyz/info',
		canonicalInput: 'Canonical PURR/USDC spot pair 0, BTC one-hour candle at 1788480000000 ms, and live borrow/lend USDC reserve token index 0 queried on 2026-09-04',
	},
	tonElectorTransaction: {
		owner: 'TON Center TONAPI',
		authority: 'https://tonapi.io/v2/blockchain/accounts/-1:3333333333333333333333333333333333333333333333333333333333333333/transactions',
		canonicalInput: 'Canonical active masterchain elector account and immutable transaction logical time 101384778000002/hash 6b308756…, reverified with TONAPI exact before_lt lookup and TON Center v3; linked masterchain block -1:8000000000000000:90661059 and both block hashes were reverified on 2026-09-04 local time',
	},
	tonElectorGetMethod: {
		owner: 'TON system-contract documentation',
		authority: 'https://docs.ton.org/v3/documentation/network/config-params/update',
		canonicalInput: 'Canonical elector system contract and its documented active_election_id getter',
	},
	stellarHorizonMainnet: {
		owner: 'Stellar Development Foundation Horizon',
		authority: 'https://horizon.stellar.org/',
		canonicalInput: 'Mainnet ledger 64275592 and directly linked Horizon resources queried on 2026-09-04',
	},
	starknetStrkBlock: {
		owner: 'Starknet public JSON-RPC',
		authority: 'https://starknet-rpc.publicnode.com',
		canonicalInput: 'Mainnet block 14379799/hash 0x1c55eb6b…, its sole successful transaction 0x2c29da1b…, canonical STRK contract/class, and storage key zero queried and cross-linked on 2026-09-04 local time',
	},
	snapshotEnsSpace: {
		owner: 'Snapshot Hub',
		authority: 'https://hub.snapshot.org/graphql',
		canonicalInput: 'ENS space ens.eth, its current proposal 0x943e585d… with 67 votes, and directly linked vote 0x24b4538a… queried on 2026-09-04',
	},
	tzktMainnet: {
		owner: 'TzKT Tezos indexer',
		authority: 'https://api.tzkt.io/',
		canonicalInput: 'Mainnet head block 14805148, inactive legacy foundation baker, and directly linked account, FA2 contract, and token 3 queried on 2026-09-04',
	},
	beaconMainnetPublicNode: {
		owner: 'Ethereum Beacon API PublicNode',
		authority: 'https://ethereum-beacon-api.publicnode.com/',
		canonicalInput: 'Finalized mainnet block root at slot 15144992 with data column 0, plus active validator 830776 and its pubkey queried on 2026-09-04',
	},
	balancerMainnet: {
		owner: 'Balancer API',
		authority: 'https://api-v3.balancer.fi/',
		canonicalInput: 'Ethereum mainnet rETH/waEthWETH pool with current APR items, reserve tokens, voting gauge, and recent swap event queried on 2026-09-04',
	},
	osmosisMainnetLcd: {
		owner: 'Osmosis LCD',
		authority: 'https://lcd.osmosis.zone/',
		canonicalInput: 'Mainnet pool 1 and uosmo asset, live concentrated-liquidity position 12, denom trace transfer/channel-144, channel-0, connection-0, and 07-tendermint-0 queried on 2026-09-04',
	},
	suiMainnetGraphql: {
		owner: 'Mysten Labs Sui GraphQL',
		authority: 'https://graphql.mainnet.sui.io/graphql',
		canonicalInput: 'Mainnet checkpoint 318800406 and linked programmable transaction with command, event, account, balance change, and object change; plus system package 0x2 version 59 with sui::transfer and sui::SUI queried on 2026-09-04',
	},
	xrplMainnetRippled: {
		owner: 'XRPL Foundation public rippled/Clio service and XRPScan',
		authority: 'https://s1.ripple.com:51234',
		canonicalInput: 'Validated mainnet ledger 106766487, its first ledger-data entry, transaction 11379BC3…, a genesis-account USD trustline, the enabled AMM amendment, and the XRP/GateHub USD AMM queried through primary public providers on 2026-09-04',
	},
	uniswapV3Ethereum: {
		owner: 'Uniswap V3',
		authority: 'https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments',
		canonicalInput: 'Ethereum mainnet USDC/WETH 0.05% pool and canonical token pair; NonfungiblePositionManager token 1 and its owner/position state were reverified at fixed block 25908000 on 2026-09-04 local time',
	},
} as const
