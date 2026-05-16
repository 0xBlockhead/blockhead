/**
 * Materialized network upgrade entities (execution, consensus, umbrella NetworkUpgrade).
 * Generated: pnpm exec tsx scripts/emit-network-upgrade-entity-lists.ts
 * Edit NetworkUpgradeActivations.ts then re-run.
 */

// Types/constants
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'


// Constants
export const networkExecutionUpgrades = [
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Frontier'
		},
		'name': 'Frontier',
		'slug': 'frontier',
		'protocol': 'Ethereum',
		'activationBlock': 1,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#frontier',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/frontier.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Frontier Thawing'
		},
		'name': 'Frontier Thawing',
		'slug': 'frontier-thawing',
		'protocol': 'Ethereum',
		'activationBlock': 200000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#frontier-thawing',
		'linkForkcast': 'https://forkcast.org'
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Homestead'
		},
		'name': 'Homestead',
		'slug': 'homestead',
		'protocol': 'Ethereum',
		'activationBlock': 1150000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#homestead',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/homestead.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 606
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'DAOFork'
		},
		'name': 'DAOFork',
		'slug': 'daofork',
		'protocol': 'Ethereum',
		'activationBlock': 1920000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#dao-fork',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/dao-fork.md',
		'linkForkcast': 'https://forkcast.org'
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'EIP150'
		},
		'name': 'EIP150',
		'slug': 'eip150',
		'protocol': 'Ethereum',
		'activationBlock': 2463000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#tangerine-whistle',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/tangerine-whistle.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 608
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'EIP155'
		},
		'name': 'EIP155',
		'slug': 'eip155',
		'protocol': 'Ethereum',
		'activationBlock': 2675000
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'EIP158'
		},
		'name': 'EIP158',
		'slug': 'eip158',
		'protocol': 'Ethereum',
		'activationBlock': 2675000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#spurious-dragon',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/spurious-dragon.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 607
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Byzantium'
		},
		'name': 'Byzantium',
		'slug': 'byzantium',
		'protocol': 'Ethereum',
		'activationBlock': 4370000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#byzantium',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/byzantium.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 609
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Constantinople'
		},
		'name': 'Constantinople',
		'slug': 'constantinople',
		'protocol': 'Ethereum',
		'activationBlock': 7280000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#constantinople',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/constantinople.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1013
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Petersburg'
		},
		'name': 'Petersburg',
		'slug': 'petersburg',
		'protocol': 'Ethereum',
		'activationBlock': 7280000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#petersburg',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/petersburg.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1716
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Istanbul'
		},
		'name': 'Istanbul',
		'slug': 'istanbul',
		'protocol': 'Ethereum',
		'activationBlock': 9069000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#istanbul',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/istanbul.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1679
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'MuirGlacier'
		},
		'name': 'MuirGlacier',
		'slug': 'muirglacier',
		'protocol': 'Ethereum',
		'activationBlock': 9200000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#muir-glacier',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/muir-glacier.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2384
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Berlin'
		},
		'name': 'Berlin',
		'slug': 'berlin',
		'protocol': 'Ethereum',
		'activationBlock': 12244000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#berlin',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/berlin.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2565
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2929
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2718
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2930
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'London'
		},
		'name': 'London',
		'slug': 'london',
		'protocol': 'Ethereum',
		'activationBlock': 12965000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#london',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/london.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1559
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3198
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3529
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3541
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'ArrowGlacier'
		},
		'name': 'ArrowGlacier',
		'slug': 'arrowglacier',
		'protocol': 'Ethereum',
		'activationBlock': 13773000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#arrow-glacier',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/arrow-glacier.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 4345
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Gray Glacier'
		},
		'name': 'Gray Glacier',
		'slug': 'gray-glacier',
		'protocol': 'Ethereum',
		'activationBlock': 15050000,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#gray-glacier',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/gray-glacier.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 5133
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Paris'
		},
		'name': 'Paris',
		'slug': 'paris',
		'protocol': 'Ethereum',
		'activationBlock': 15537394,
		'activationTimestamp': 1663224162,
		'linkEthereumOrg': 'https://ethereum.org/en/history/#paris',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/merge.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3675
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 4399
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Shanghai'
		},
		'name': 'Shanghai',
		'slug': 'shanghai',
		'protocol': 'Ethereum',
		'activationTimestamp': 1681338455,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#shanghai-capella-shapella',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/shanghai.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3651
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3855
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3860
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 4895
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Cancun'
		},
		'name': 'Cancun',
		'slug': 'cancun',
		'protocol': 'Ethereum',
		'activationTimestamp': 1710338135,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#cancun-deneb-dencun',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/cancun.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1153
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 4844
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 4788
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 5656
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 6780
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7044
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7045
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7514
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7516
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Prague'
		},
		'name': 'Prague',
		'slug': 'prague',
		'protocol': 'Ethereum',
		'activationTimestamp': 1746612311,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#prague-electra-pectra',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/prague.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2537
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2935
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 6110
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7002
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7251
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7623
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7685
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7691
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7702
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Osaka'
		},
		'name': 'Osaka',
		'slug': 'osaka',
		'protocol': 'Ethereum',
		'activationTimestamp': 1764798551,
		'linkEthereumOrg': 'https://ethereum.org/en/roadmap/fusaka/',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/fusaka.md',
		'linkForkcast': 'https://forkcast.org',
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7594
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7642
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7823
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7825
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7883
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7892
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7910
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7917
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7918
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7934
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7935
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7939
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7951
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Bedrock'
		},
		'name': 'Bedrock',
		'slug': 'bedrock',
		'protocol': 'OpStack',
		'activationTimestamp': 1686079703
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Canyon'
		},
		'name': 'Canyon',
		'slug': 'canyon',
		'protocol': 'OpStack',
		'activationTimestamp': 1704992401
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Delta'
		},
		'name': 'Delta',
		'slug': 'delta',
		'protocol': 'OpStack',
		'activationTimestamp': 1708560000
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Ecotone'
		},
		'name': 'Ecotone',
		'slug': 'ecotone',
		'protocol': 'OpStack',
		'activationTimestamp': 1710374401
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Fjord'
		},
		'name': 'Fjord',
		'slug': 'fjord',
		'protocol': 'OpStack',
		'activationTimestamp': 1720627201
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Granite'
		},
		'name': 'Granite',
		'slug': 'granite',
		'protocol': 'OpStack',
		'activationTimestamp': 1726070401
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Holocene'
		},
		'name': 'Holocene',
		'slug': 'holocene',
		'protocol': 'OpStack',
		'activationTimestamp': 1736445601
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Isthmus'
		},
		'name': 'Isthmus',
		'slug': 'isthmus',
		'protocol': 'OpStack',
		'activationTimestamp': 1746806401
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Jovian'
		},
		'name': 'Jovian',
		'slug': 'jovian',
		'protocol': 'OpStack',
		'activationTimestamp': 1764691201
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Bedrock'
		},
		'name': 'Bedrock',
		'slug': 'bedrock',
		'protocol': 'OpStack',
		'activationTimestamp': 1686079703
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Canyon'
		},
		'name': 'Canyon',
		'slug': 'canyon',
		'protocol': 'OpStack',
		'activationTimestamp': 1704992401
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Delta'
		},
		'name': 'Delta',
		'slug': 'delta',
		'protocol': 'OpStack',
		'activationTimestamp': 1708560000
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Ecotone'
		},
		'name': 'Ecotone',
		'slug': 'ecotone',
		'protocol': 'OpStack',
		'activationTimestamp': 1710374401
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Fjord'
		},
		'name': 'Fjord',
		'slug': 'fjord',
		'protocol': 'OpStack',
		'activationTimestamp': 1720627201
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Granite'
		},
		'name': 'Granite',
		'slug': 'granite',
		'protocol': 'OpStack',
		'activationTimestamp': 1726070401
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Holocene'
		},
		'name': 'Holocene',
		'slug': 'holocene',
		'protocol': 'OpStack',
		'activationTimestamp': 1736445601
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Isthmus'
		},
		'name': 'Isthmus',
		'slug': 'isthmus',
		'protocol': 'OpStack',
		'activationTimestamp': 1746806401
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Jovian'
		},
		'name': 'Jovian',
		'slug': 'jovian',
		'protocol': 'OpStack',
		'activationTimestamp': 1764691201
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Homestead'
		},
		'name': 'Homestead',
		'slug': 'homestead',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'EIP150'
		},
		'name': 'EIP150',
		'slug': 'eip150',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'EIP155'
		},
		'name': 'EIP155',
		'slug': 'eip155',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'EIP158'
		},
		'name': 'EIP158',
		'slug': 'eip158',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Byzantium'
		},
		'name': 'Byzantium',
		'slug': 'byzantium',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Constantinople'
		},
		'name': 'Constantinople',
		'slug': 'constantinople',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Petersburg'
		},
		'name': 'Petersburg',
		'slug': 'petersburg',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Istanbul'
		},
		'name': 'Istanbul',
		'slug': 'istanbul',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Berlin'
		},
		'name': 'Berlin',
		'slug': 'berlin',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'London'
		},
		'name': 'London',
		'slug': 'london',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Paris'
		},
		'name': 'Paris',
		'slug': 'paris',
		'protocol': 'Ethereum',
		'activationBlock': 0,
		'activationTimestamp': 1695996000,
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/merge.md'
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Shanghai'
		},
		'name': 'Shanghai',
		'slug': 'shanghai',
		'protocol': 'Ethereum',
		'activationTimestamp': 1696000704
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Cancun'
		},
		'name': 'Cancun',
		'slug': 'cancun',
		'protocol': 'Ethereum',
		'activationTimestamp': 1707305664
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Prague'
		},
		'name': 'Prague',
		'slug': 'prague',
		'protocol': 'Ethereum',
		'activationTimestamp': 1740387840,
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/prague.md'
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Osaka'
		},
		'name': 'Osaka',
		'slug': 'osaka',
		'protocol': 'Ethereum',
		'activationTimestamp': 1759296000,
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/fusaka.md'
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Canyon'
		},
		'name': 'Canyon',
		'slug': 'canyon',
		'protocol': 'OpStack',
		'activationTimestamp': 1699981200
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Delta'
		},
		'name': 'Delta',
		'slug': 'delta',
		'protocol': 'OpStack',
		'activationTimestamp': 1703203200
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Ecotone'
		},
		'name': 'Ecotone',
		'slug': 'ecotone',
		'protocol': 'OpStack',
		'activationTimestamp': 1708534800
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Fjord'
		},
		'name': 'Fjord',
		'slug': 'fjord',
		'protocol': 'OpStack',
		'activationTimestamp': 1716998400
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Granite'
		},
		'name': 'Granite',
		'slug': 'granite',
		'protocol': 'OpStack',
		'activationTimestamp': 1723478400
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Holocene'
		},
		'name': 'Holocene',
		'slug': 'holocene',
		'protocol': 'OpStack',
		'activationTimestamp': 1732633200
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Prague blob schedule'
		},
		'name': 'Prague blob schedule',
		'slug': 'prague-blob-schedule',
		'layer': 'blob',
		'protocol': 'OpStack',
		'activationTimestamp': 1742486400
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Isthmus'
		},
		'name': 'Isthmus',
		'slug': 'isthmus',
		'protocol': 'OpStack',
		'activationTimestamp': 1744905600
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Jovian'
		},
		'name': 'Jovian',
		'slug': 'jovian',
		'protocol': 'OpStack',
		'activationTimestamp': 1763568001
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Homestead'
		},
		'name': 'Homestead',
		'slug': 'homestead',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'EIP150'
		},
		'name': 'EIP150',
		'slug': 'eip150',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'EIP155'
		},
		'name': 'EIP155',
		'slug': 'eip155',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'EIP158'
		},
		'name': 'EIP158',
		'slug': 'eip158',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Byzantium'
		},
		'name': 'Byzantium',
		'slug': 'byzantium',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Constantinople'
		},
		'name': 'Constantinople',
		'slug': 'constantinople',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Petersburg'
		},
		'name': 'Petersburg',
		'slug': 'petersburg',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Istanbul'
		},
		'name': 'Istanbul',
		'slug': 'istanbul',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'MuirGlacier'
		},
		'name': 'MuirGlacier',
		'slug': 'muirglacier',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Berlin'
		},
		'name': 'Berlin',
		'slug': 'berlin',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'London'
		},
		'name': 'London',
		'slug': 'london',
		'protocol': 'Ethereum',
		'activationBlock': 0
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Paris'
		},
		'name': 'Paris',
		'slug': 'paris',
		'protocol': 'Ethereum',
		'activationBlock': 1735371,
		'activationTimestamp': 1676323200,
		'linkEthereumOrg': 'https://ethereum.org/ethereum-forks/#paris',
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/merge.md',
		'linkForkcast': 'https://forkcast.org'
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Shanghai'
		},
		'name': 'Shanghai',
		'slug': 'shanghai',
		'protocol': 'Ethereum',
		'activationTimestamp': 1677557088
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Cancun'
		},
		'name': 'Cancun',
		'slug': 'cancun',
		'protocol': 'Ethereum',
		'activationTimestamp': 1706655072
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Prague'
		},
		'name': 'Prague',
		'slug': 'prague',
		'protocol': 'Ethereum',
		'activationTimestamp': 1741162176,
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/prague.md'
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Osaka'
		},
		'name': 'Osaka',
		'slug': 'osaka',
		'protocol': 'Ethereum',
		'activationTimestamp': 1760422560,
		'linkExecutionDocs': 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/fusaka.md'
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Canyon'
		},
		'name': 'Canyon',
		'slug': 'canyon',
		'protocol': 'OpStack',
		'activationTimestamp': 1699981200
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Delta'
		},
		'name': 'Delta',
		'slug': 'delta',
		'protocol': 'OpStack',
		'activationTimestamp': 1703203200
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Ecotone'
		},
		'name': 'Ecotone',
		'slug': 'ecotone',
		'protocol': 'OpStack',
		'activationTimestamp': 1708534800
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Fjord'
		},
		'name': 'Fjord',
		'slug': 'fjord',
		'protocol': 'OpStack',
		'activationTimestamp': 1716998400
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Granite'
		},
		'name': 'Granite',
		'slug': 'granite',
		'protocol': 'OpStack',
		'activationTimestamp': 1723478400
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Holocene'
		},
		'name': 'Holocene',
		'slug': 'holocene',
		'protocol': 'OpStack',
		'activationTimestamp': 1732633200
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Prague blob schedule'
		},
		'name': 'Prague blob schedule',
		'slug': 'prague-blob-schedule',
		'layer': 'blob',
		'protocol': 'OpStack',
		'activationTimestamp': 1742486400
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Isthmus'
		},
		'name': 'Isthmus',
		'slug': 'isthmus',
		'protocol': 'OpStack',
		'activationTimestamp': 1744905600
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Jovian'
		},
		'name': 'Jovian',
		'slug': 'jovian',
		'protocol': 'OpStack',
		'activationTimestamp': 1763568001
	}
] as readonly Entity<typeof schema, EntityType.NetworkExecutionUpgrade>[]

export const networkConsensusUpgrades = [
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Altair'
		},
		'name': 'Altair',
		'slug': 'altair',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 74240,
		'linkEthereumOrg': 'https://ethereum.org/en/history/#altair',
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/altair/beacon-chain.md',
		'linkForkcast': 'https://forkcast.org'
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Bellatrix'
		},
		'name': 'Bellatrix',
		'slug': 'bellatrix',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 144896,
		'linkEthereumOrg': 'https://ethereum.org/en/history/#bellatrix',
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/bellatrix/beacon-chain.md',
		'linkForkcast': 'https://forkcast.org'
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Capella'
		},
		'name': 'Capella',
		'slug': 'capella',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 194048,
		'linkEthereumOrg': 'https://ethereum.org/en/history/#capella',
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/capella/beacon-chain.md',
		'linkForkcast': 'https://forkcast.org'
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Deneb'
		},
		'name': 'Deneb',
		'slug': 'deneb',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 269568,
		'linkEthereumOrg': 'https://ethereum.org/en/history/#deneb',
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/deneb/beacon-chain.md',
		'linkForkcast': 'https://forkcast.org'
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Electra'
		},
		'name': 'Electra',
		'slug': 'electra',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 364032,
		'linkEthereumOrg': 'https://ethereum.org/en/history/#electra',
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/electra/beacon-chain.md',
		'linkForkcast': 'https://forkcast.org'
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Fulu'
		},
		'name': 'Fulu',
		'slug': 'fulu',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 411392,
		'linkEthereumOrg': 'https://ethereum.org/en/roadmap/fusaka/',
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/beacon-chain.md',
		'linkForkcast': 'https://forkcast.org'
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Bellatrix'
		},
		'name': 'Bellatrix',
		'slug': 'bellatrix',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 0,
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/bellatrix/beacon-chain.md'
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Capella'
		},
		'name': 'Capella',
		'slug': 'capella',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 256,
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/capella/'
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Deneb'
		},
		'name': 'Deneb',
		'slug': 'deneb',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 29696,
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/deneb/'
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Electra'
		},
		'name': 'Electra',
		'slug': 'electra',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 115968,
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/electra/'
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Fulu'
		},
		'name': 'Fulu',
		'slug': 'fulu',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 165120,
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/beacon-chain.md'
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Altair'
		},
		'name': 'Altair',
		'slug': 'altair',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 50,
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/altair/beacon-chain.md'
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Bellatrix'
		},
		'name': 'Bellatrix',
		'slug': 'bellatrix',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 100,
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/bellatrix/beacon-chain.md'
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Capella'
		},
		'name': 'Capella',
		'slug': 'capella',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 56832,
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/capella/'
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Deneb'
		},
		'name': 'Deneb',
		'slug': 'deneb',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 132608,
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/deneb/'
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Electra'
		},
		'name': 'Electra',
		'slug': 'electra',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 222464,
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/electra/'
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Fulu'
		},
		'name': 'Fulu',
		'slug': 'fulu',
		'protocol': 'EthereumBeacon',
		'activationEpoch': 272640,
		'linkConsensusDocs': 'https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/beacon-chain.md'
	}
] as readonly Entity<typeof schema, EntityType.NetworkConsensusUpgrade>[]

export const networkUpgrades = [
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Frontier'
		},
		'name': 'Frontier',
		'slug': 'frontier',
		'activationBlock': 1,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Frontier'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Frontier Thawing'
		},
		'name': 'Frontier Thawing',
		'slug': 'frontier-thawing',
		'activationBlock': 200000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Frontier Thawing'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Homestead'
		},
		'name': 'Homestead',
		'slug': 'homestead',
		'activationBlock': 1150000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Homestead'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 606
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'DAOFork'
		},
		'name': 'DAOFork',
		'slug': 'daofork',
		'activationBlock': 1920000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'DAOFork'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'EIP150'
		},
		'name': 'EIP150',
		'slug': 'eip150',
		'activationBlock': 2463000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'EIP150'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 608
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'EIP155'
		},
		'name': 'EIP155',
		'slug': 'eip155',
		'activationBlock': 2675000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'EIP155'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'EIP158'
		},
		'name': 'EIP158',
		'slug': 'eip158',
		'activationBlock': 2675000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'EIP158'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 607
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Byzantium'
		},
		'name': 'Byzantium',
		'slug': 'byzantium',
		'activationBlock': 4370000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Byzantium'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 609
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Constantinople'
		},
		'name': 'Constantinople',
		'slug': 'constantinople',
		'activationBlock': 7280000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Constantinople'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1013
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Petersburg'
		},
		'name': 'Petersburg',
		'slug': 'petersburg',
		'activationBlock': 7280000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Petersburg'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1716
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Istanbul'
		},
		'name': 'Istanbul',
		'slug': 'istanbul',
		'activationBlock': 9069000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Istanbul'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1679
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'MuirGlacier'
		},
		'name': 'MuirGlacier',
		'slug': 'muirglacier',
		'activationBlock': 9200000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'MuirGlacier'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2384
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Berlin'
		},
		'name': 'Berlin',
		'slug': 'berlin',
		'activationBlock': 12244000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Berlin'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2565
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2929
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2718
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2930
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'London'
		},
		'name': 'London',
		'slug': 'london',
		'activationBlock': 12965000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'London'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1559
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3198
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3529
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3541
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'ArrowGlacier'
		},
		'name': 'ArrowGlacier',
		'slug': 'arrowglacier',
		'activationBlock': 13773000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'ArrowGlacier'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 4345
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Gray Glacier'
		},
		'name': 'Gray Glacier',
		'slug': 'gray-glacier',
		'activationBlock': 15050000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Gray Glacier'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 5133
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Altair'
		},
		'name': 'Altair',
		'slug': 'altair',
		'activationEpoch': 74240,
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Altair'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Bedrock'
		},
		'name': 'Bedrock',
		'slug': 'bedrock',
		'activationTimestamp': 1686079703,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 10
				},
				'upgradeId': 'Bedrock'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Canyon'
		},
		'name': 'Canyon',
		'slug': 'canyon',
		'activationTimestamp': 1704992401,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 10
				},
				'upgradeId': 'Canyon'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Delta'
		},
		'name': 'Delta',
		'slug': 'delta',
		'activationTimestamp': 1708560000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 10
				},
				'upgradeId': 'Delta'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Ecotone'
		},
		'name': 'Ecotone',
		'slug': 'ecotone',
		'activationTimestamp': 1710374401,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 10
				},
				'upgradeId': 'Ecotone'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Fjord'
		},
		'name': 'Fjord',
		'slug': 'fjord',
		'activationTimestamp': 1720627201,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 10
				},
				'upgradeId': 'Fjord'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Granite'
		},
		'name': 'Granite',
		'slug': 'granite',
		'activationTimestamp': 1726070401,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 10
				},
				'upgradeId': 'Granite'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Holocene'
		},
		'name': 'Holocene',
		'slug': 'holocene',
		'activationTimestamp': 1736445601,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 10
				},
				'upgradeId': 'Holocene'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Isthmus'
		},
		'name': 'Isthmus',
		'slug': 'isthmus',
		'activationTimestamp': 1746806401,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 10
				},
				'upgradeId': 'Isthmus'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 10
			},
			'upgradeId': 'Jovian'
		},
		'name': 'Jovian',
		'slug': 'jovian',
		'activationTimestamp': 1764691201,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 10
				},
				'upgradeId': 'Jovian'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Bedrock'
		},
		'name': 'Bedrock',
		'slug': 'bedrock',
		'activationTimestamp': 1686079703,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 8453
				},
				'upgradeId': 'Bedrock'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Canyon'
		},
		'name': 'Canyon',
		'slug': 'canyon',
		'activationTimestamp': 1704992401,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 8453
				},
				'upgradeId': 'Canyon'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Delta'
		},
		'name': 'Delta',
		'slug': 'delta',
		'activationTimestamp': 1708560000,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 8453
				},
				'upgradeId': 'Delta'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Ecotone'
		},
		'name': 'Ecotone',
		'slug': 'ecotone',
		'activationTimestamp': 1710374401,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 8453
				},
				'upgradeId': 'Ecotone'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Fjord'
		},
		'name': 'Fjord',
		'slug': 'fjord',
		'activationTimestamp': 1720627201,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 8453
				},
				'upgradeId': 'Fjord'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Granite'
		},
		'name': 'Granite',
		'slug': 'granite',
		'activationTimestamp': 1726070401,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 8453
				},
				'upgradeId': 'Granite'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Holocene'
		},
		'name': 'Holocene',
		'slug': 'holocene',
		'activationTimestamp': 1736445601,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 8453
				},
				'upgradeId': 'Holocene'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Isthmus'
		},
		'name': 'Isthmus',
		'slug': 'isthmus',
		'activationTimestamp': 1746806401,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 8453
				},
				'upgradeId': 'Isthmus'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 8453
			},
			'upgradeId': 'Jovian'
		},
		'name': 'Jovian',
		'slug': 'jovian',
		'activationTimestamp': 1764691201,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 8453
				},
				'upgradeId': 'Jovian'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Homestead'
		},
		'name': 'Homestead',
		'slug': 'homestead',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Homestead'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'EIP150'
		},
		'name': 'EIP150',
		'slug': 'eip150',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'EIP150'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'EIP155'
		},
		'name': 'EIP155',
		'slug': 'eip155',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'EIP155'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'EIP158'
		},
		'name': 'EIP158',
		'slug': 'eip158',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'EIP158'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Byzantium'
		},
		'name': 'Byzantium',
		'slug': 'byzantium',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Byzantium'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Constantinople'
		},
		'name': 'Constantinople',
		'slug': 'constantinople',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Constantinople'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Petersburg'
		},
		'name': 'Petersburg',
		'slug': 'petersburg',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Petersburg'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Istanbul'
		},
		'name': 'Istanbul',
		'slug': 'istanbul',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Istanbul'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Berlin'
		},
		'name': 'Berlin',
		'slug': 'berlin',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Berlin'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'London'
		},
		'name': 'London',
		'slug': 'london',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'London'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Canyon'
		},
		'name': 'Canyon',
		'slug': 'canyon',
		'activationTimestamp': 1699981200,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 84532
				},
				'upgradeId': 'Canyon'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Delta'
		},
		'name': 'Delta',
		'slug': 'delta',
		'activationTimestamp': 1703203200,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 84532
				},
				'upgradeId': 'Delta'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Ecotone'
		},
		'name': 'Ecotone',
		'slug': 'ecotone',
		'activationTimestamp': 1708534800,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 84532
				},
				'upgradeId': 'Ecotone'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Fjord'
		},
		'name': 'Fjord',
		'slug': 'fjord',
		'activationTimestamp': 1716998400,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 84532
				},
				'upgradeId': 'Fjord'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Granite'
		},
		'name': 'Granite',
		'slug': 'granite',
		'activationTimestamp': 1723478400,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 84532
				},
				'upgradeId': 'Granite'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Holocene'
		},
		'name': 'Holocene',
		'slug': 'holocene',
		'activationTimestamp': 1732633200,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 84532
				},
				'upgradeId': 'Holocene'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Prague blob schedule'
		},
		'name': 'Prague blob schedule',
		'slug': 'prague-blob-schedule',
		'activationTimestamp': 1742486400,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 84532
				},
				'upgradeId': 'Prague blob schedule'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Isthmus'
		},
		'name': 'Isthmus',
		'slug': 'isthmus',
		'activationTimestamp': 1744905600,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 84532
				},
				'upgradeId': 'Isthmus'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 84532
			},
			'upgradeId': 'Jovian'
		},
		'name': 'Jovian',
		'slug': 'jovian',
		'activationTimestamp': 1763568001,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 84532
				},
				'upgradeId': 'Jovian'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Homestead'
		},
		'name': 'Homestead',
		'slug': 'homestead',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Homestead'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'EIP150'
		},
		'name': 'EIP150',
		'slug': 'eip150',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'EIP150'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'EIP155'
		},
		'name': 'EIP155',
		'slug': 'eip155',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'EIP155'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'EIP158'
		},
		'name': 'EIP158',
		'slug': 'eip158',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'EIP158'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Byzantium'
		},
		'name': 'Byzantium',
		'slug': 'byzantium',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Byzantium'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Constantinople'
		},
		'name': 'Constantinople',
		'slug': 'constantinople',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Constantinople'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Petersburg'
		},
		'name': 'Petersburg',
		'slug': 'petersburg',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Petersburg'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Istanbul'
		},
		'name': 'Istanbul',
		'slug': 'istanbul',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Istanbul'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'MuirGlacier'
		},
		'name': 'MuirGlacier',
		'slug': 'muirglacier',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'MuirGlacier'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Berlin'
		},
		'name': 'Berlin',
		'slug': 'berlin',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Berlin'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'London'
		},
		'name': 'London',
		'slug': 'london',
		'activationBlock': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'London'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Altair'
		},
		'name': 'Altair',
		'slug': 'altair',
		'activationEpoch': 50,
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Altair'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Canyon'
		},
		'name': 'Canyon',
		'slug': 'canyon',
		'activationTimestamp': 1699981200,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155420
				},
				'upgradeId': 'Canyon'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Delta'
		},
		'name': 'Delta',
		'slug': 'delta',
		'activationTimestamp': 1703203200,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155420
				},
				'upgradeId': 'Delta'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Ecotone'
		},
		'name': 'Ecotone',
		'slug': 'ecotone',
		'activationTimestamp': 1708534800,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155420
				},
				'upgradeId': 'Ecotone'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Fjord'
		},
		'name': 'Fjord',
		'slug': 'fjord',
		'activationTimestamp': 1716998400,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155420
				},
				'upgradeId': 'Fjord'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Granite'
		},
		'name': 'Granite',
		'slug': 'granite',
		'activationTimestamp': 1723478400,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155420
				},
				'upgradeId': 'Granite'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Holocene'
		},
		'name': 'Holocene',
		'slug': 'holocene',
		'activationTimestamp': 1732633200,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155420
				},
				'upgradeId': 'Holocene'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Prague blob schedule'
		},
		'name': 'Prague blob schedule',
		'slug': 'prague-blob-schedule',
		'activationTimestamp': 1742486400,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155420
				},
				'upgradeId': 'Prague blob schedule'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Isthmus'
		},
		'name': 'Isthmus',
		'slug': 'isthmus',
		'activationTimestamp': 1744905600,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155420
				},
				'upgradeId': 'Isthmus'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155420
			},
			'upgradeId': 'Jovian'
		},
		'name': 'Jovian',
		'slug': 'jovian',
		'activationTimestamp': 1763568001,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155420
				},
				'upgradeId': 'Jovian'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Merge'
		},
		'name': 'The Merge',
		'slug': 'merge',
		'activationBlock': 15537394,
		'activationTimestamp': 1663224162,
		'activationEpoch': 144896,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Paris'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Bellatrix'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3675
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 4399
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Shapella'
		},
		'name': 'Shapella',
		'slug': 'shapella',
		'activationTimestamp': 1681338455,
		'activationEpoch': 194048,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Shanghai'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Capella'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3651
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3855
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 3860
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 4895
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Dencun'
		},
		'name': 'Dencun',
		'slug': 'dencun',
		'activationTimestamp': 1710338135,
		'activationEpoch': 269568,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Cancun'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Deneb'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 1153
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 4844
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 4788
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 5656
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 6780
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7044
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7045
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7514
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7516
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Pectra'
		},
		'name': 'Pectra',
		'slug': 'pectra',
		'activationTimestamp': 1746612311,
		'activationEpoch': 364032,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Prague'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Electra'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2537
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 2935
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 6110
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7002
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7251
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7623
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7685
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7691
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7702
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 1
			},
			'upgradeId': 'Fusaka'
		},
		'name': 'Fusaka',
		'slug': 'fusaka',
		'activationTimestamp': 1764798551,
		'activationEpoch': 411392,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Osaka'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 1
				},
				'upgradeId': 'Fulu'
			}
		},
		'$$proposals': [
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7594
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7642
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7823
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7825
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7883
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7892
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7910
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7917
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7918
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7934
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7935
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7939
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			},
			{
				'__id': {
					'realm': 'Ethereum',
					'category': 'Eip',
					'number': 7951
				},
				'documentTitle': null,
				'documentCategory': null,
				'documentStatus': null,
				'documentBody': null
			}
		]
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Merge'
		},
		'name': 'The Merge',
		'slug': 'merge',
		'activationBlock': 0,
		'activationTimestamp': 1695996000,
		'activationEpoch': 0,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Paris'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Bellatrix'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Shapella'
		},
		'name': 'Shapella',
		'slug': 'shapella',
		'activationTimestamp': 1696000704,
		'activationEpoch': 256,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Shanghai'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Capella'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Dencun'
		},
		'name': 'Dencun',
		'slug': 'dencun',
		'activationTimestamp': 1707305664,
		'activationEpoch': 29696,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Cancun'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Deneb'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Pectra'
		},
		'name': 'Pectra',
		'slug': 'pectra',
		'activationTimestamp': 1740387840,
		'activationEpoch': 115968,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Prague'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Electra'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 17000
			},
			'upgradeId': 'Fusaka'
		},
		'name': 'Fusaka',
		'slug': 'fusaka',
		'activationTimestamp': 1759296000,
		'activationEpoch': 165120,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Osaka'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 17000
				},
				'upgradeId': 'Fulu'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Merge'
		},
		'name': 'The Merge',
		'slug': 'merge',
		'activationBlock': 1735371,
		'activationTimestamp': 1676323200,
		'activationEpoch': 100,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Paris'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Bellatrix'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Shapella'
		},
		'name': 'Shapella',
		'slug': 'shapella',
		'activationTimestamp': 1677557088,
		'activationEpoch': 56832,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Shanghai'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Capella'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Dencun'
		},
		'name': 'Dencun',
		'slug': 'dencun',
		'activationTimestamp': 1706655072,
		'activationEpoch': 132608,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Cancun'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Deneb'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Pectra'
		},
		'name': 'Pectra',
		'slug': 'pectra',
		'activationTimestamp': 1741162176,
		'activationEpoch': 222464,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Prague'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Electra'
			}
		}
	},
	{
		'__id': {
			'$network': {
				'chainId': 11155111
			},
			'upgradeId': 'Fusaka'
		},
		'name': 'Fusaka',
		'slug': 'fusaka',
		'activationTimestamp': 1760422560,
		'activationEpoch': 272640,
		'$executionUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Osaka'
			}
		},
		'$consensusUpgrade': {
			'__id': {
				'$network': {
					'chainId': 11155111
				},
				'upgradeId': 'Fulu'
			}
		}
	}
] as readonly Entity<typeof schema, EntityType.NetworkUpgrade>[]
