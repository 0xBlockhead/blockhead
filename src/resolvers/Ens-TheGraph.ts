import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { ensQueries } from '$/sources/TheGraph/Graphql/Ens/queries.ts'

const {
	getDomainsByOwner,
	getDomainsByResolvedAddress,
	getDomainsContaining,
	getEnsSubgraphReachability,
	getName,
	getReverseRecord,
} = ensQueries
import { hexLowerOfByteSize, with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
const normalizedEnsSearchQuery = (query: string) => {
	const trimmedQuery = query.trim()
	if (trimmedQuery === '') throw new Error('TheGraph_Graphql: empty ENS search query')
	try {
		return ensToString(ensNormalizeNode(trimmedQuery))
	} catch {
		return trimmedQuery.toLowerCase()
	}
}

const bigintFromSubgraphScalar = (value: unknown) => (
	value == null ?
		null
	:
		BigInt(String(value))
)

const timestampMsFromSubgraphUnixSeconds = (value: unknown) => {
	const seconds = bigintFromSubgraphScalar(value)
	if (seconds == null)
		return undefined
	const timestampMs = Number(seconds) * 1000
	return Number.isSafeInteger(timestampMs) && timestampMs >= 0 ?
		timestampMs
	:
		undefined
}

const ensRecordKindFromRecordKey = (recordKey: string) => (
	recordKey.startsWith('coin:') ?
		'coin'
	: recordKey.startsWith('text:') ?
		'text'
	: recordKey === 'contenthash' ?
		'contenthash'
	:
		'text'
)

const evmAccountFromSubgraphAccount = (
	account: { id: string } | null | undefined
): Entity<typeof schema, EntityType.EvmAccount> | null => {
	const address = (
		account?.id == null ?
			undefined
		:
			hexLowerOfByteSize(account.id, 20)
	)
	return address == null ?
		null
	:
		{
			[EntityMetaKey.Selector]: {
				address,
			},
		}
}

const ensRecordTipValueFromDomain = (
	domain: {
		resolver?: {
			addr?: {
				id: string
			} | null
			contentHash?: string | null
			events?: readonly {
				__typename: string
				blockNumber: number
				key?: string
				value?: string | null
				coinType?: unknown
				addr?: string | null
			}[] | null
		} | null
	},
	recordKey: string
) => {
	if (recordKey === 'contenthash') {
		const contentHash = domain.resolver?.contentHash
		return contentHash == null || contentHash === '' || contentHash === '0x' ?
			undefined
		:
			String(contentHash)
	}
	const events = domain.resolver?.events ?? []
	if (recordKey.startsWith('text:')) {
		const textKey = recordKey.slice('text:'.length)
		const latest = events
			.filter((event) => (
				event.__typename === 'TextChanged'
				&& event.key === textKey
			))
			.reduce<(typeof events)[number] | null>((current, event) => (
				current == null || event.blockNumber > current.blockNumber ?
					event
				:
					current
			), null)
		return latest?.value == null ?
			undefined
		:
			String(latest.value)
	}
	if (recordKey.startsWith('coin:')) {
		const coinType = recordKey.slice('coin:'.length)
		const latestMulticoin = events
			.filter((event) => (
				event.__typename === 'MulticoinAddrChanged'
				&& String(event.coinType) === coinType
			))
			.reduce<(typeof events)[number] | null>((current, event) => (
				current == null || event.blockNumber > current.blockNumber ?
					event
				:
					current
			), null)
		if (latestMulticoin?.addr != null)
			return String(latestMulticoin.addr)

		// Legacy ETH tip: subgraph `resolver.addr` when MulticoinAddrChanged is absent for coin type 60.
		if (coinType === '60' && domain.resolver?.addr?.id != null)
			return String(domain.resolver.addr.id)

		return undefined
	}
	return undefined
}

export default {
	source: Source.TheGraph_Graphql,

	resolvers: [
		defineResolver({
			entityType: EntityType._GlobalEnsNetwork_Timestamp,
			resolve: {
				HubTimestampMsSource: {
					resolve: async ({
						$hub,
						timestampMs,
						source,
					}, context) => {
						if (source !== Source.TheGraph_Graphql)
							throw new Error('TheGraph_Graphql: ENS hub observation source mismatch')

						let reachable = true
						try {
							await getEnsSubgraphReachability({
								publicEnv: context.publicEnv,
							})
						} catch {
							reachable = false
						}

						return {
							$hub: {
								[EntityMetaKey.Selector]: {
									scope: '_GlobalEnsNetwork' as const,
								},
							},
							timestampMs,
							source,
							reachable,
						}
					},
				},
			},
		})({
			$hub: (observation) => observation.$hub,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			reachable: (observation) => observation.reachable,
		}),

		defineResolver({
			entityType: EntityType.EnsName,
			resolve: {
				NormalizedName: {
					resolve: async ({ name }, context) => {
						const normalizedName = ensToString(ensNormalizeNode(name))
						const matchingEnsDomain = (
							await getName({
								publicEnv: context.publicEnv,
								name: normalizedName,
							})
						).find((candidate) => candidate.name === normalizedName)
						if (matchingEnsDomain == null)
							throw new Error('TheGraph_Graphql: ENS name not in subgraph')

						const parentName = matchingEnsDomain.parent?.name
						const resolverAddress = hexLowerOfByteSize(
							String(matchingEnsDomain.resolver?.address ?? ''),
							20
						)
						const resolvedActor = evmAccountFromSubgraphAccount(
							matchingEnsDomain.resolvedAddress
							?? matchingEnsDomain.resolver?.addr
						)
						const ownerActor = evmAccountFromSubgraphAccount(matchingEnsDomain.owner)
						const registrantActor = evmAccountFromSubgraphAccount(
							matchingEnsDomain.registration?.registrant
							?? matchingEnsDomain.registrant
						)
						const wrapperOwnerActor = evmAccountFromSubgraphAccount(matchingEnsDomain.wrappedOwner)
						const createdAtMs = timestampMsFromSubgraphUnixSeconds(matchingEnsDomain.createdAt)
						const registeredAtMs = timestampMsFromSubgraphUnixSeconds(
							matchingEnsDomain.registration?.registrationDate
						)
						const registrationExpiryAtMs = timestampMsFromSubgraphUnixSeconds(
							matchingEnsDomain.registration?.expiryDate
						)
						const wrapperExpiryAtMs = timestampMsFromSubgraphUnixSeconds(
							matchingEnsDomain.wrappedDomain?.expiryDate
						)
						const resolverTextKeys = matchingEnsDomain.resolver?.texts?.map(String) ?? []
						const resolverCoinTypes = matchingEnsDomain.resolver?.coinTypes
							?.filter((coinType) => coinType != null)
							.map(String) ?? []
						const ttl = bigintFromSubgraphScalar(matchingEnsDomain.ttl)
						const subdomainEnsNameEntities = matchingEnsDomain.subdomains.flatMap((subdomain) => (
							subdomain.name != null && subdomain.name !== '' ?
								[{
									[EntityMetaKey.Selector]: {
										name: subdomain.name,
									},
								}]
							:
								[]
						))
						const observedAtMs = Date.now()
						const recordKeys = [
							...resolverTextKeys.map((textKey) => `text:${textKey}`),
							...resolverCoinTypes.map((coinType) => `coin:${coinType}`),
							...(ensRecordTipValueFromDomain(matchingEnsDomain, 'contenthash') === undefined ?
								[]
							:
								['contenthash']
							),
						]
						const recordEntities = recordKeys.map((recordKey) => {
							const coinType = recordKey.startsWith('coin:') ?
								Number(recordKey.slice('coin:'.length))
							:
								undefined
							const value = ensRecordTipValueFromDomain(matchingEnsDomain, recordKey)
							return {
								[EntityMetaKey.Selector]: {
									$name: {
										name: normalizedName,
									},
									recordKey,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EnsRecord, [], '$name')]: {
										[EntityMetaKey.Selector]: {
											name: normalizedName,
										},
									},
									[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKey')]: recordKey,
									[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKind')]: ensRecordKindFromRecordKey(recordKey),
									...(coinType != null && Number.isSafeInteger(coinType) && {
										[entityFieldAddressKey(EntityType.EnsRecord, [], 'coinType')]: coinType,
									}),
									[entityFieldAddressKey(EntityType.EnsRecord, [], '$$timestamps')]: [{
										[EntityMetaKey.Selector]: {
											$record: {
												$name: {
													name: normalizedName,
												},
												recordKey,
											},
											timestampMs: observedAtMs,
											source: Source.TheGraph_Graphql,
										},
										[EntityMetaKey.Fields]: {
											...(value !== undefined && {
												[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: value,
											}),
										},
									}],
								},
							}
						})
						const textRecords = Object.fromEntries(
							resolverTextKeys.flatMap((textKey) => {
								const value = ensRecordTipValueFromDomain(
									matchingEnsDomain,
									`text:${textKey}`
								)
								return value === undefined ?
									[]
								:
									[[
										textKey,
										value,
									]]
							})
						)

						return {
							name: normalizedName,
							normalizedName,
							node: String(matchingEnsDomain.id),
							subdomainCount: matchingEnsDomain.subdomainCount,
							...(matchingEnsDomain.labelName != null
								&& matchingEnsDomain.labelName !== '' && {
								labelName: matchingEnsDomain.labelName,
							}),
							...(matchingEnsDomain.labelhash != null
								&& matchingEnsDomain.labelhash !== '' && {
								labelhash: String(matchingEnsDomain.labelhash),
							}),
							...(parentName != null && parentName !== '' && {
								$parent: {
									[EntityMetaKey.Selector]: {
										name: parentName,
									},
								},
							}),
							$$subdomains: subdomainEnsNameEntities,
							...(resolverAddress != null && {
								$resolverContract: {
									[EntityMetaKey.Selector]: {
										$network: {
											caip2: {
												namespace: 'eip155',
												reference: '1',
											},
										},
										address: resolverAddress,
									},
								},
							}),
							...(resolvedActor != null && {
								$subgraphResolvedActor: resolvedActor,
							}),
							...(ownerActor != null && {
								$ownerActor: ownerActor,
							}),
							...(registrantActor != null && {
								$registrantActor: registrantActor,
							}),
							...(wrapperOwnerActor != null && {
								$wrapperOwnerActor: wrapperOwnerActor,
							}),
							...(createdAtMs != null && {
								createdAtMs,
							}),
							...(registeredAtMs != null && {
								registeredAtMs,
							}),
							...(registrationExpiryAtMs != null && {
								registrationExpiryAtMs,
							}),
							...(matchingEnsDomain.wrappedDomain != null && {
								wrapperFuses: matchingEnsDomain.wrappedDomain.fuses,
							}),
							...(wrapperExpiryAtMs != null && {
								wrapperExpiryAtMs,
							}),
							...(resolverTextKeys.length > 0 && {
								resolverTextKeys,
							}),
							...(resolverCoinTypes.length > 0 && {
								resolverCoinTypes,
							}),
							...(Object.keys(textRecords).length > 0 && {
								textRecords,
							}),
							$$records: recordEntities,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$name: {
										name: normalizedName,
									},
									timestampMs: observedAtMs,
									source: Source.TheGraph_Graphql,
								},
								[EntityMetaKey.Fields]: {
									...(resolvedActor != null && {
										[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], '$resolvedActor')]: resolvedActor,
									}),
									...(resolverAddress != null && {
										[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], '$resolverContract')]: {
											[EntityMetaKey.Selector]: {
												$network: {
													caip2: {
														namespace: 'eip155',
														reference: '1',
													},
												},
												address: resolverAddress,
											},
										},
									}),
									...(ownerActor != null && {
										[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], '$ownerActor')]: ownerActor,
									}),
									[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], 'subdomainCount')]: matchingEnsDomain.subdomainCount,
									...(resolverTextKeys.length > 0 && {
										[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], 'resolverTextKeys')]: resolverTextKeys,
									}),
									...(resolverCoinTypes.length > 0 && {
										[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], 'resolverCoinTypes')]: resolverCoinTypes,
									}),
									...(ttl != null && {
										[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], 'ttl')]: ttl,
									}),
									[entityFieldAddressKey(EntityType.EnsName_Timestamp, [], 'isMigrated')]: matchingEnsDomain.isMigrated,
								},
							}],
						}
					},
				},
			},
		})({
				name: (ensName) => ensName.name,
				normalizedName: (ensName) => ensName.normalizedName,
				node: (ensName) => ensName.node,
				labelName: (ensName) => ensName.labelName,
				labelhash: (ensName) => ensName.labelhash,
				$parent: (ensName) => ensName.$parent,
				$$subdomains: {
					select: (ensName) => ensName.$$subdomains,
					resolveCount: (ensName) => ensName.subdomainCount,
				},
				$resolverContract: (ensName) => ensName.$resolverContract,
				$subgraphResolvedActor: (ensName) => ensName.$subgraphResolvedActor,
				$ownerActor: (ensName) => ensName.$ownerActor,
				$registrantActor: (ensName) => ensName.$registrantActor,
				$wrapperOwnerActor: (ensName) => ensName.$wrapperOwnerActor,
				createdAtMs: (ensName) => ensName.createdAtMs,
				registeredAtMs: (ensName) => ensName.registeredAtMs,
				registrationExpiryAtMs: (ensName) => ensName.registrationExpiryAtMs,
				wrapperFuses: (ensName) => ensName.wrapperFuses,
				wrapperExpiryAtMs: (ensName) => ensName.wrapperExpiryAtMs,
				resolverTextKeys: (ensName) => ensName.resolverTextKeys,
				resolverCoinTypes: (ensName) => ensName.resolverCoinTypes,
				textRecords: (ensName) => ensName.textRecords,
				$$records: {
					select: (ensName) => ensName.$$records,
					resolveCount: (ensName) => ensName.$$records.length,
				},
				$$timestamps: {
					select: (ensName) => ensName.$$timestamps,
					resolveCount: (ensName) => ensName.$$timestamps.length,
				},
			}),

		defineResolver({
			entityType: EntityType.EvmAccount,
			resolve: {
				AddressInteropAddress: {
					resolve: async ({ address }, context) => {
						const accountAddress = zeroExLowerCase(address)
						const [
							ownedDomains,
							resolvedDomains,
						] = await Promise.all([
							getDomainsByOwner({
								publicEnv: context.publicEnv,
								owner: accountAddress,
							}),
							getDomainsByResolvedAddress({
								publicEnv: context.publicEnv,
								resolvedAddress: accountAddress,
							}),
						])
						const ensNamesOwned = ownedDomains.flatMap((domain) => (
							domain.name != null && domain.name !== '' ?
								[{
									[EntityMetaKey.Selector]: {
										name: domain.name,
									},
								}]
							:
								[]
						))
						const ownedNameByNormalized = new Set(
							ensNamesOwned.map((ensName) => ensName[EntityMetaKey.Selector].name)
						)
						const primaryResolvedDomain = (
							resolvedDomains.find((domain) => (
								domain.name != null
								&& domain.name !== ''
								&& ownedNameByNormalized.has(domain.name)
							))
							?? resolvedDomains.find((domain) => (
								domain.name != null
								&& domain.name !== ''
							))
						)
						return {
							ensNamesOwned,
							...(primaryResolvedDomain?.name != null && primaryResolvedDomain.name !== '' && {
								$primaryName: {
									[EntityMetaKey.Selector]: {
										name: primaryResolvedDomain.name,
									},
								},
							}),
						}
					},
				},
			},
		})({
				$$ensNamesOwned: {
					select: (snapshot) => snapshot.ensNamesOwned,
					resolveCount: (snapshot) => snapshot.ensNamesOwned.length,
				},
				$primaryName: (snapshot) => snapshot.$primaryName,
			}),

		defineResolver({
			entityType: EntityType.EnsRecord,
			resolve: {
				NameRecordKey: {
					resolve: async ({ $name, recordKey }, context) => {
						const normalizedName = ensToString(ensNormalizeNode($name.name))
						const domains = await getName({
							publicEnv: context.publicEnv,
							name: normalizedName,
						})
						if (domains == null)
							throw new Error('TheGraph_Graphql: ENS record name not in subgraph')
						const matchingEnsDomain = domains.find((candidate) => candidate.name === normalizedName)
						if (matchingEnsDomain == null)
							throw new Error('TheGraph_Graphql: ENS record name not in subgraph')

						const coinType = recordKey.startsWith('coin:') ?
							Number(recordKey.slice('coin:'.length))
						:
							undefined
						const observedAtMs = Date.now()
						const value = ensRecordTipValueFromDomain(matchingEnsDomain, recordKey)

						return {
							$name: {
								[EntityMetaKey.Selector]: {
									name: normalizedName,
								},
							},
							recordKey,
							recordKind: ensRecordKindFromRecordKey(recordKey),
							...(coinType == null || Number.isNaN(coinType) ? {} : { coinType }),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$record: {
										$name: {
											name: normalizedName,
										},
										recordKey,
									},
									timestampMs: observedAtMs,
									source: Source.TheGraph_Graphql,
								},
								[EntityMetaKey.Fields]: {
									...(value !== undefined && {
										[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: value,
									}),
								},
							}],
						}
					},
				},
			},
		})({
				$name: (ensRecord) => ensRecord.$name,
				recordKey: (ensRecord) => ensRecord.recordKey,
				recordKind: (ensRecord) => ensRecord.recordKind,
				coinType: (ensRecord) => ensRecord.coinType,
				$$timestamps: {
					select: (ensRecord) => ensRecord.$$timestamps,
					resolveCount: (ensRecord) => ensRecord.$$timestamps.length,
				},
			}),

		defineResolver({
			entityType: EntityType.BlockheadEnsNameSearch,
			resolve: {
				Query: {
					resolve: async ({ query: querySelector }, context) => {
					const limit = resolverContextRowLimit(context)
					const query = normalizedEnsSearchQuery(querySelector)
					return (
						(await getDomainsContaining({
							publicEnv: context.publicEnv,
							query,
							limit,
						}))
							.flatMap((domain) => (
								domain.name != null && domain.name !== '' ?
									[{
										[EntityMetaKey.Selector]: {
											name: domain.name,
										},
									}]
								:
									[]
							))
					)
				},
				}
			},
		})({
				$$matchingNames: (matchingNames) => matchingNames,
			}),

		defineResolver({
			entityType: EntityType.EnsReverseRecord,
			resolve: {
				AccountName: {
					resolve: async ({ $account, $name }, context) => {
						const { caip10 } = $account
						if (caip10.namespace !== 'eip155')
							throw new Error('TheGraph_Graphql: ENS reverse record requires an EVM account')

						const normalizedAddress = hexLowerOfByteSize(with0xHex(caip10.accountAddress), 20)
						if (normalizedAddress == null)
							throw new Error('TheGraph_Graphql: ENS reverse record requires a 20-byte EVM address')

						const normalizedName = ensToString(ensNormalizeNode($name.name))
						const { forward, reverse } = await getReverseRecord({
							publicEnv: context.publicEnv,
							name: normalizedName,
							accountAddress: normalizedAddress,
						})
						const forwardResolvedId = forward?.resolvedAddress.id ?? forward?.resolver.addr.id
						const resolverAddress = reverse?.resolver.address ?? forward?.resolver.address
						const resolverContractAddress = hexLowerOfByteSize(String(resolverAddress ?? ''), 20)

						return {
							accountSelector: $account,
							name: normalizedName,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$reverseRecord: {
										$account,
										$name: {
											name: normalizedName,
										},
									},
									timestampMs: Date.now(),
									source: Source.TheGraph_Graphql,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EnsReverseRecord_Timestamp, [], 'verified')]: (
										forwardResolvedId != null
										&& with0xHex(String(forwardResolvedId)) === normalizedAddress
										&& reverse?.resolver.address != null
									),
									...(resolverContractAddress != null && {
										[entityFieldAddressKey(EntityType.EnsReverseRecord_Timestamp, [], 'resolverSelector')]: {
											[EntityMetaKey.Selector]: {
												$network: {
													caip2: {
														namespace: 'eip155',
														reference: '1',
													},
												},
												address: resolverContractAddress,
											},
										},
									}),
								},
							}],
						}
					},
				},
			},
		})({
			$account: (snapshot) => ({
				[EntityMetaKey.Selector]: snapshot.accountSelector,
			}),
			$name: (snapshot) => ({
				[EntityMetaKey.Selector]: {
					name: snapshot.name,
				},
			}),
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule
