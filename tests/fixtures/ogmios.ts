export const createOgmiosFixture = () => ({
	tipPoint: {
		slot: 130000102,
		id: 'c248757d390181c517a5beadc9c3fe64bf821d3e889a963fc717003ec248757d',
	},
	protocolParameters: {
		minFeeCoefficient: 44,
		minFeeConstant: {
			ada: {
				lovelace: 155381,
			},
		},
		minUtxoDepositCoefficient: 4310,
		minUtxoDepositConstant: {
			ada: {
				lovelace: 0,
			},
		},
		maxBlockBodySize: {
			bytes: 90112,
		},
		maxBlockHeaderSize: {
			bytes: 1100,
		},
		maxTransactionSize: {
			bytes: 16384,
		},
		maxValueSize: {
			bytes: 5000,
		},
		stakeCredentialDeposit: {
			ada: {
				lovelace: 2000000,
			},
		},
		stakePoolDeposit: {
			ada: {
				lovelace: 500000000,
			},
		},
		stakePoolRetirementEpochBound: 18,
		stakePoolPledgeInfluence: '3/10',
		minStakePoolCost: {
			ada: {
				lovelace: 340000000,
			},
		},
		monetaryExpansion: '3/1000',
		treasuryExpansion: '1/5',
		desiredNumberOfStakePools: 500,
		federatedBlockProductionRatio: '0/1',
		collateralPercentage: 150,
		maxCollateralInputs: 3,
		plutusCostModels: {
			'plutus:v3': [
				1,
				2,
				3,
			],
		},
		scriptExecutionPrices: {
			memory: '577/10000',
			cpu: '721/10000000',
		},
		maxExecutionUnitsPerTransaction: {
			memory: 14000000,
			cpu: 10000000000,
		},
		maxExecutionUnitsPerBlock: {
			memory: 62000000,
			cpu: 20000000000,
		},
		version: {
			major: 9,
			minor: 0,
		},
	},
} as const)
