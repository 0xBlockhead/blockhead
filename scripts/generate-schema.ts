import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'

type EntityRecord = {
	name: string
	selectors: SelectorRecord[]
	fields: FieldRecord[]
	sources: string[]
	view?: string
	notes?: string
	label?: string
	labelPlural?: string
	description?: string
	fieldMetadataByName: Record<string, FieldMetadata>
}

type SelectorRecord = {
	name: string
	fields: string[]
}

type FieldRecord = {
	name: string
	cardinality: 'Zero' | 'One' | 'ZeroOrOne' | 'Many' | 'ZeroOrMany'
	kind: 'primitive' | 'entity' | 'entities'
	typeText: string
	when?: string
}

type FieldMetadata = {
	label?: string
	labelPlural?: string
	description?: string
}

const cwd = process.cwd()
const schemaMarkdownPath = join(cwd, 'SCHEMA.md')
const schemaDirectory = join(cwd, 'src/schema')
const schemaBackupDirectory = join(cwd, 'src/schema_')
const viewsDirectory = join(cwd, 'src/views')
const viewsIndexPath = join(viewsDirectory, 'index.ts')
const generatedSupportFiles = new Set([
	'$params.ts',
	'$schema.ts',
	'EntityDefinition.spec.ts',
	'EntityType.ts',
	'EvmAbi.ts',
	'MarketAsset.ts',
	'NetworkUpgradeProtocols.ts',
	'UrlString.ts',
	'ZeroExHex.ts',
	'index.ts',
])

const acronymByWord = new Map(Object.entries({
	abi: 'ABI',
	ai: 'AI',
	api: 'API',
	activitypub: 'ActivityPub',
	at: 'AT',
	atom: 'Atom',
	avm: 'AVM',
	bft: 'BFT',
	bip: 'BIP',
	bitcoin: 'Bitcoin',
	bittorrent: 'BitTorrent',
	bzz: 'BZZ',
	caip: 'CAIP',
	cashu: 'Cashu',
	cid: 'CID',
	cors: 'CORS',
	cosmos: 'Cosmos',
	csv: 'CSV',
	dag: 'DAG',
	dai: 'DAI',
	dapp: 'dapp',
	dapps: 'dapps',
	dht: 'DHT',
	did: 'DID',
	dlc: 'DLC',
	dns: 'DNS',
	eip: 'EIP',
	ens: 'ENS',
	erc: 'ERC',
	evm: 'EVM',
	farcaster: 'Farcaster',
	fedimint: 'Fedimint',
	fid: 'FID',
	gas: 'gas',
	git: 'Git',
	github: 'GitHub',
	graphql: 'GraphQL',
	hash: 'hash',
	html: 'HTML',
	http: 'HTTP',
	https: 'HTTPS',
	id: 'ID',
	ip: 'IP',
	ipfs: 'IPFS',
	ipns: 'IPNS',
	json: 'JSON',
	lightning: 'Lightning',
	logos: 'Logos',
	lsp: 'LSP',
	mempool: 'mempool',
	mweb: 'MWEB',
	nft: 'NFT',
	nostr: 'Nostr',
	oauth: 'OAuth',
	ohlc: 'OHLC',
	p2p: 'P2P',
	pubkey: 'public key',
	pubkeys: 'public keys',
	reddit: 'Reddit',
	rest: 'REST',
	rfc: 'RFC',
	rpc: 'RPC',
	rss: 'RSS',
	sdk: 'SDK',
	sql: 'SQL',
	ssh: 'SSH',
	ssz: 'SSZ',
	tx: 'transaction',
	txs: 'transactions',
	uid: 'UID',
	uri: 'URI',
	url: 'URL',
	utf: 'UTF',
	utxo: 'UTXO',
	wasm: 'Wasm',
	web: 'Web',
	webhook: 'webhook',
	x: 'X',
	xmtp: 'XMTP',
	xrpc: 'XRPC',
	youtube: 'YouTube',
	zerog: 'ZeroG',
}))

const explicitFieldLabels = new Map(Object.entries({
	address: 'Address',
	blockHash: 'Block hash',
	blockNumber: 'Block number',
	caip2: 'CAIP-2',
	caip10: 'CAIP-10',
	chainId: 'Chain ID',
	cid: 'CID',
	createdAt: 'Created',
	decimals: 'Decimals',
	description: 'Description',
	did: 'DID',
	hash: 'Hash',
	height: 'Height',
	id: 'ID',
	label: 'Label',
	name: 'Name',
	namespace: 'Namespace',
	reference: 'Reference',
	scope: 'Scope',
	slug: 'Slug',
	source: 'Source',
	symbol: 'Symbol',
	timestampMs: 'Timestamp',
	tokenId: 'Token ID',
	txHash: 'Transaction hash',
	type: 'Type',
	updatedAt: 'Updated',
	uri: 'URI',
	url: 'URL',
	value: 'Value',
}))

const explicitFieldDescriptions = new Map(Object.entries({
	address: 'The address or account identifier used by the source protocol.',
	blockHash: 'The hash that identifies the block in its network.',
	blockNumber: 'The block height or number in its network.',
	caip2: 'The chain identifier in CAIP-2 namespace and reference form.',
	caip10: 'The account identifier in CAIP-10 namespace, reference, and address form.',
	chainId: 'The chain identifier used by the network family.',
	contractAddress: 'The contract address on its network.',
	createdAt: 'The time when the subject was created according to the source.',
	decimals: 'The number of decimal places used to display the amount.',
	description: 'A human-readable description from the source domain.',
	hash: 'The hash that identifies this object in its protocol.',
	height: 'The block or ledger height in its network.',
	id: 'The identifier assigned by the source domain.',
	label: 'A human-readable name for the subject.',
	name: 'The human-readable name of the subject.',
	namespace: 'The namespace that qualifies the identifier.',
	reference: 'The namespace-specific reference value.',
	scope: 'The fixed scope value that identifies this hub row.',
	slug: 'A stable short name used by catalogs and URLs.',
	source: 'The source that produced this observation.',
	symbol: 'The short ticker or symbol used for display.',
	timestampMs: 'The observation time in Unix milliseconds.',
	tokenId: 'The token identifier within its collection or contract.',
	txHash: 'The transaction hash in its network.',
	type: 'The source-domain type or category.',
	updatedAt: 'The time when the subject was last updated according to the source.',
	url: 'The URL for the source-domain resource.',
	value: 'The source-domain value.',
}))

const explicitEntityDescriptions = new Map(Object.entries({
	_Global: 'Root catalog and navigation scope for top-level networks, assets, markets, proposals, and local Blockhead state.',
	Account: 'A cross-chain account identity expressed with CAIP namespace, reference, and address fields.',
	AssetClass: 'A reusable asset classification used to group related asset instances and objects.',
	AssetInstance: 'A concrete asset on a specific network or venue, such as a native coin, token, share, or collectible.',
	AssetObject: 'A distinct asset object or item within an asset instance, such as an NFT or uniquely addressable collectible.',
	Coin: 'A market-facing coin or crypto asset identity used across price, market, and network contexts.',
	Currency: 'A currency unit used for quoting values, balances, and market data.',
	EvmAccount: 'An account address in the EVM address space, independent of any one chain.',
	EvmBlock: 'A block in an EVM-compatible execution chain.',
	EvmContract: 'A smart contract account and its contract-specific metadata on an EVM-compatible network.',
	EvmLog: 'An event log emitted by an EVM transaction receipt.',
	EvmNetwork: 'An EVM-compatible chain or rollup identified independently of any single RPC provider.',
	EvmNetwork_Timestamp: 'A point-in-time observation of an EVM-compatible network.',
	EvmTransaction: 'A transaction submitted to or included in an EVM-compatible network.',
	Market: 'A tradeable market or quote pair on a venue.',
	Market_Timestamp: 'A point-in-time market quote or metric observation.',
	Network: 'A blockchain, ledger, or protocol network with its own identity and supporting metadata.',
	Network_Timestamp: 'A point-in-time observation of network status or metrics.',
	SpecificationProposal: 'A standards or governance proposal in a specification process.',
	Url: 'A web URL that is modeled as a referenced resource rather than an inline string.',
}))

const splitTopLevel = (
	text: string,
	separator: string
) => {
	const parts: string[] = []
	let depth = 0
	let quote: string | undefined
	let start = 0

	for (let index = 0; index < text.length; index++) {
		const character = text[index]

		if (quote) {
			if (character === quote && text[index - 1] !== '\\')
				quote = undefined

			continue
		}

		if (character === '\'' || character === '"') {
			quote = character
			continue
		}

		if (character === '{' || character === '[' || character === '(' || character === '<')
			depth++
		else if (character === '}' || character === ']' || character === ')' || character === '>')
			depth--
		else if (depth === 0 && text.startsWith(separator, index)) {
			parts.push(text.slice(start, index).trim())
			index += separator.length - 1
			start = index + 1
		}
	}

	parts.push(text.slice(start).trim())
	return parts.filter(Boolean)
}

const splitWhen = (
	text: string
) => {
	const marker = ' when '
	let depth = 0
	let quote: string | undefined

	for (let index = 0; index < text.length; index++) {
		const character = text[index]

		if (quote) {
			if (character === quote && text[index - 1] !== '\\')
				quote = undefined

			continue
		}

		if (character === '\'' || character === '"') {
			quote = character
			continue
		}

		if (character === '{' || character === '[' || character === '(' || character === '<')
			depth++
		else if (character === '}' || character === ']' || character === ')' || character === '>')
			depth--
		else if (depth === 0 && text.startsWith(marker, index))
			return {
				fieldText: text.slice(0, index).trim(),
				when: text.slice(index + marker.length).trim(),
			}
	}

	return {
		fieldText: text.trim(),
	}
}

const parseSelectors = (
	text: string
) => splitTopLevel(text, ',').flatMap((selector) => {
	const separatorIndex = selector.indexOf(':')

	if (separatorIndex === -1) {
		return splitTopLevel(selector, ' | ').map((part) => ({
			name: part.trim(),
			fields: [
				part.trim(),
			],
		}))
	}

	const name = selector.slice(0, separatorIndex).trim()
	const fieldsText = selector.slice(separatorIndex + 1).trim()

	if (!name || !fieldsText)
		throw new Error(`Invalid selector: ${selector}`)

	const selectorNames = splitTopLevel(name, ' | ')
	const selectorFields = splitTopLevel(fieldsText, ' | ')

	if (selectorNames.length > 1 || selectorFields.length > 1)
		return selectorNames.map((selectorName, index) => ({
			name: selectorName.trim(),
			fields: [
				(selectorFields[index] ?? selectorName).trim(),
			],
		}))

	return {
		name: name.trim(),
		fields: fieldsText.split('+').map((field) => field.trim()).filter(Boolean),
	}
})

const parseField = (
	text: string
) => {
	const { fieldText, when } = splitWhen(text)
	const [rawName, rawType] = fieldText.split(/ +/, 2)

	if (!rawName || !rawType)
		throw new Error(`Invalid field: ${text}`)

	const optional = rawName.endsWith('?')
	const rawNameWithoutOptional = optional ? rawName.slice(0, -1) : rawName
	const required = rawNameWithoutOptional.endsWith('!')
	const many = rawNameWithoutOptional.endsWith('*') || rawNameWithoutOptional.endsWith('+')
	const zero = rawNameWithoutOptional.endsWith('0')
	const name = rawNameWithoutOptional.replace(/[!*+0]$/, '')
	const typeText = fieldText.slice(rawName.length).trim()
	const kind = (
		typeText.startsWith('$:') && name.startsWith('$$') ?
			'entities'
		: typeText.startsWith('$:') ?
			'entity'
		:
			'primitive'
	)

	return {
		name,
		cardinality: (
			zero ?
				'Zero'
			: kind === 'entities' && optional ?
				'ZeroOrMany'
			: many ?
				(
					optional ?
						'ZeroOrMany'
					:
						'Many'
				)
			: required ?
				'One'
			:
				'ZeroOrOne'
		),
		kind,
		typeText,
		...(when && { when }),
	} satisfies FieldRecord
}

const parseMetadata = (
	text: string
) => Object.fromEntries(splitTopLevel(text, ' ; ').map((part) => {
	const index = part.indexOf(' :: ')

	if (index === -1)
		throw new Error(`Invalid metadata clause: ${part}`)

	return [
		part.slice(0, index).trim(),
		part.slice(index + 4).trim(),
	]
}))

const parseSchemaMarkdown = (
	markdown: string
) => {
	const lines = markdown.split('\n')
	const entities: EntityRecord[] = []

	for (let index = 0; index < lines.length; index++) {
		const entityMatch = lines[index].match(/^  Entity ([^ ]+)(?: :: (.*) ; (.*))?$/)

		if (!entityMatch)
			continue

		const entity: EntityRecord = {
			name: entityMatch[1],
			selectors: entityMatch[2] ? parseSelectors(entityMatch[2]) : [],
			fields: entityMatch[3] ? splitTopLevel(entityMatch[3], ',').map(parseField) : [],
			sources: [],
			fieldMetadataByName: {},
		}

		for (index++; index < lines.length; index++) {
			const line = lines[index]

			if (line.startsWith('  Entity ')) {
				index--
				break
			}

			if (line.startsWith('    Selectors :: ')) {
				entity.selectors = parseSelectors(line.slice('    Selectors :: '.length).trim())
				continue
			}

			if (line.startsWith('    Fields :: ')) {
				entity.fields = splitTopLevel(line.slice('    Fields :: '.length).trim(), ',').map(parseField)
				continue
			}

			if (line.startsWith('    Label :: ')) {
				entity.label = line.slice('    Label :: '.length).trim()
				continue
			}

			if (line.startsWith('    LabelPlural :: ')) {
				entity.labelPlural = line.slice('    LabelPlural :: '.length).trim()
				continue
			}

			if (line.startsWith('    Description :: ')) {
				entity.description = line.slice('    Description :: '.length).trim()
				continue
			}

			const fieldMetadataMatch = line.match(/^    Field ([^ ]+) :: (.*)$/)

			if (fieldMetadataMatch) {
				const metadata = parseMetadata(fieldMetadataMatch[2])
				entity.fieldMetadataByName[fieldMetadataMatch[1]] = {
					...(metadata.Label && { label: metadata.Label }),
					...(metadata.LabelPlural && { labelPlural: metadata.LabelPlural }),
					...(metadata.Description && { description: metadata.Description }),
				}
				continue
			}

			if (line === '    Sources ::') {
				for (index++; index < lines.length && lines[index].startsWith('      - '); index++)
					entity.sources.push(lines[index].slice('      - '.length).trim())

				index--
				continue
			}

			if (line.startsWith('    View :: ')) {
				entity.view = line.slice('    View :: '.length).trim()
				continue
			}

			if (line.startsWith('    Notes :: ')) {
				entity.notes = line.slice('    Notes :: '.length).trim()
				continue
			}
		}

		if (!entity.selectors.length)
			throw new Error(`Entity ${entity.name} has no selectors`)

		if (!entity.fields.length)
			throw new Error(`Entity ${entity.name} has no fields`)

		entities.push(entity)
	}

	return entities
}

const words = (
	text: string
) => text
	.replace(/^_Global$/, 'Global')
	.replace(/^_Global/, 'Global')
	.replace(/^\$+/, '')
	.replace(/_/g, ' ')
	.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
	.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
	.split(/[^A-Za-z0-9]+/)
	.filter(Boolean)

const humanWords = (
	text: string
) => words(text).map((word) => {
	const lower = word.toLowerCase()
	return acronymByWord.get(lower) ?? lower
})

const sentenceCase = (
	text: string
) => text ? `${text[0].toUpperCase()}${text.slice(1)}` : text

const pluralize = (
	label: string
) => {
	if (label.endsWith('public key'))
		return `${label}s`

	if (label.endsWith('timestamp'))
		return label.replace(/timestamp$/, 'observations')

	if (label.endsWith('y') && !/[aeiou]y$/.test(label))
		return `${label.slice(0, -1)}ies`

	if (/(s|x|z|ch|sh)$/.test(label))
		return `${label}es`

	return `${label}s`
}

const entityLabel = (
	entity: EntityRecord
) => (
	entity.label && !entity.label.startsWith('global global') ?
		entity.label
	:
		humanWords(entity.name).join(' ').replace(/^global global /, 'global ')
)

const entityLabelPlural = (
	entity: EntityRecord
) => (
	entity.labelPlural && !entity.labelPlural.startsWith('global global') ?
		entity.labelPlural
	:
		pluralize(entityLabel(entity))
)

const fieldLabel = (
	field: FieldRecord
) => explicitFieldLabels.get(field.name.replace(/^\$+/, '')) ?? humanWords(field.name).join(' ')

const entityDescription = (
	entity: EntityRecord
) => entity.description ?? explicitEntityDescriptions.get(entity.name)

const fieldDescription = (
	field: FieldRecord,
	metadata: FieldMetadata
) => (
	metadata.description
	?? explicitFieldDescriptions.get(field.name.replace(/^\$+/, ''))
)

const formatSchemaMarkdown = (
	entities: EntityRecord[]
) => [
	'# Blockhead Schema',
	'',
	'Schema Language v1. `SCHEMA.md` is the schema design source of truth. Run `pnpm run schema:sync` after editing it, and run `pnpm run schema:check` in review to verify that `SCHEMA.md` and `src/schema/**` agree.',
	'',
	'Each entity block starts with `Entity Name`, then `Selectors :: selectorName: field+field` and `Fields :: field! p:type, field? p:type, field* $:Entity`. Field suffixes mean required (`!`), optional (`?`), many (`*`), or impossible (`0`). `$field` references one entity and `$$field` references many entities. `Field name :: ...` lines hold user-facing language only; modeling notes stay in `Notes ::`.',
	'',
	'```text',
	'SchemaVersion 1',
	'',
		...entities.flatMap((entity) => {
			const lines = [
				`  Entity ${entity.name}`,
				`    Selectors :: ${entity.selectors.map((selector) => `${selector.name}: ${selector.fields.join('+')}`).join(', ')}`,
				`    Fields :: ${entity.fields.map(formatFieldSignature).join(', ')}`,
				`    Label :: ${entityLabel(entity)}`,
				`    LabelPlural :: ${entityLabelPlural(entity)}`,
			]
		const description = entityDescription(entity)

		if (description)
			lines.push(`    Description :: ${description}`)

		for (const field of entity.fields) {
			const metadata = entity.fieldMetadataByName[field.name] ?? {}
			const label = fieldLabel(field)
			const fieldName = field.name.replace(/^\$+/, '')
			const customLabel = metadata.label && metadata.label !== label && !explicitFieldLabels.has(fieldName) ? metadata.label : undefined
			const customLabelPlural = metadata.labelPlural && !metadata.labelPlural.endsWith('eses') ? metadata.labelPlural : undefined
			const description = fieldDescription(field, metadata)

			if (!customLabel && !customLabelPlural && !description)
				continue

			const clauses = [
				`Label :: ${customLabel ?? label}`,
			]

			if (customLabelPlural)
				clauses.push(`LabelPlural :: ${customLabelPlural}`)

			if (description)
				clauses.push(`Description :: ${description}`)

			lines.push(`    Field ${field.name} :: ${clauses.join(' ; ')}`)
		}

		if (entity.sources.length) {
			lines.push('    Sources ::')
			lines.push(...entity.sources.toSorted().map((source) => `      - ${source}`))
		}

		if (entity.view)
			lines.push(`    View :: ${entity.view}`)

		if (entity.notes)
			lines.push(`    Notes :: ${entity.notes}`)

		return [
			...lines,
			'',
		]
	}),
	'```',
	'',
].join('\n')

const formatFieldSignature = (
	field: FieldRecord
) => `${field.name}${field.cardinality === 'One' ? '!' : field.cardinality === 'Many' ? '*' : field.cardinality === 'ZeroOrMany' ? '*?' : field.cardinality === 'Zero' ? '0' : '?'} ${field.typeText}${field.when ? ` when ${field.when}` : ''}`

const selectorEnumMember = (
	selectorName: string
) => sentenceCase(humanWords(selectorName).map((word) => word.replace(/[^A-Za-z0-9]/g, '')).join(''))

const selectorEnumMemberFromFields = (
	fields: string[]
) => fields
	.map((field) => field.replace(/^\$+/, ''))
	.map((field) => `${field[0]?.toUpperCase() ?? ''}${field.slice(1)}`)
	.join('')
	.replace(/[^A-Za-z0-9]/g, '')

const legacySelectorByFields = (
	entityName: string
) => {
	const path = join(schemaBackupDirectory, `${entityName}.ts`)

	if (!existsSync(path))
		return new Map<string, {
			member: string
			value: string
		}>()

	const source = readFileSync(path, 'utf8')
	const enumEntries = new Map(
		Array.from(source.matchAll(/^\t([A-Za-z0-9_]+) = '([^']+)',/gm))
			.map(([, member, value]) => [
				member,
				value,
			])
	)
	const selectorEntries = new Map<string, {
		member: string
		value: string
	}>()

	for (const selectorMatch of source.matchAll(/name: [A-Za-z0-9_]+Selector\.([A-Za-z0-9_]+),\n\s+fields: \[\n([\s\S]*?)\n\s+\]/g)) {
		const member = selectorMatch[1]
		const value = enumEntries.get(member)

		if (!value)
			continue

		selectorEntries.set(
			Array.from(selectorMatch[2].matchAll(/'([^']+)',/g))
				.map(([, field]) => field)
				.join('+'),
			{
				member,
				value,
			}
		)
	}

	return selectorEntries
}

const preserveNonSelectorEnums = (
	entityName: string
) => {
	const path = join(schemaDirectory, `${entityName}.ts`)

	if (!existsSync(path))
		return ''

	return Array.from(readFileSync(path, 'utf8').matchAll(/export enum ([^{]+) \{[\s\S]*?\n\}/g))
		.map(([block, enumName]) => ({ block, enumName: enumName.trim() }))
		.filter(({ enumName }) => enumName !== `${entityName}Selector`)
		.map(({ block }) => `${block}\n\n`)
		.join('')
}

const primitiveTypeExpression = (
	typeText: string,
	field?: FieldRecord
) => {
	if (!typeText.startsWith('p:'))
		return undefined

	const primitive = typeText.slice(2).trim()

	if (field?.name === 'coinId' && primitive === 'enum')
		return 'type.valueOf(CoinId)'

	if (field?.name === 'marketKind' && primitive === 'enum')
		return 'type.valueOf(MarketKind)'

	if (field?.name === '$marketVenue' && primitive === '{marketVenueId:enum}')
		return 'type({ marketVenueId: type.valueOf(MarketVenueId) })'

	if (primitive === 'marketAsset')
		return 'marketAsset'

	if (primitive === 'evmAddress')
		return 'EvmAddress'

	if (
		primitive === 'zeroExHex'
		|| primitive === 'zeroExHex4'
		|| primitive === 'zeroExHex32'
	)
		return 'ZeroExHex'

	if (primitive.endsWith('[]')) {
		const itemPrimitive = primitive.slice(0, -2)

		if (itemPrimitive.startsWith('{') && itemPrimitive.endsWith('}'))
			return `type(${primitiveObjectExpression(itemPrimitive)}).array()`

		if (itemPrimitive === 'evmAddress')
			return 'EvmAddress.array()'

		if (
			itemPrimitive === 'zeroExHex'
			|| itemPrimitive === 'zeroExHex4'
			|| itemPrimitive === 'zeroExHex32'
		)
			return 'ZeroExHex.array()'

		return `type(${JSON.stringify(`${primitiveTypeSyntax(itemPrimitive)}[]`)})`
	}

	if (primitive.startsWith('{') && primitive.endsWith('}'))
		return `type(${primitiveObjectExpression(primitive)})`

	return `type(${JSON.stringify(primitiveTypeSyntax(primitive))})`
}

const primitiveObjectExpression = (
	primitive: string
) => `{${
	splitTopLevel(
		primitive.slice(1, -1),
		','
	)
		.map((part) => {
			const separatorIndex = part.indexOf(':')
			const key = part.slice(0, separatorIndex).trim()
			const value = part.slice(separatorIndex + 1).trim()

			return `${JSON.stringify(key)}: ${JSON.stringify(primitiveTypeSyntax(value))}`
		})
		.join(', ')
}}`

const primitiveTypeSyntax = (
	primitive: string
): string => (
	splitTopLevel(primitive, '|').length > 1 ?
		splitTopLevel(primitive, '|')
			.map((part) => primitiveTypeSyntax(part))
			.join(' | ')
	:
	primitive.endsWith('[]') ?
		`${primitiveTypeSyntax(primitive.slice(0, -2))}[]`
	:
	primitive.startsWith('\'') && primitive.endsWith('\'') ?
		primitive
	:
	primitive.startsWith('{') && primitive.endsWith('}') ?
		'object'
	:
	primitiveTypeKeyword(primitive)
)

const primitiveTypeKeyword = (
	primitive: string
) => {
	if ([
		'bytes',
		'caip2',
		'enum',
		'evmAddress',
		'hex',
		'hex4',
		'hex32',
		'str',
		'url',
		'zeroExHex',
		'zeroExHex4',
		'zeroExHex32',
	].includes(primitive))
		return 'string'

	if (primitive === 'num')
		return 'number'

	if (primitive === 'bigint')
		return 'bigint'

	if (primitive === 'bool')
		return 'boolean'

	if (primitive === 'null')
		return 'null'

	return 'unknown'
}

const referencedEntityType = (
	typeText: string
) => {
	if (!typeText.startsWith('$:'))
		throw new Error(`Invalid entity reference type: ${typeText}`)

	return typeText.slice(2)
}

const writeProperty = (
	key: string,
	value: string,
	indent = '\t'
) => `${indent}${key}: '${value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}',\n`

const generatedField = (
	field: FieldRecord,
	metadata: FieldMetadata
) => {
	const lines = [
		'\t\t{',
		writeProperty('name', field.name, '\t\t\t').trimEnd(),
		writeProperty('label', explicitFieldLabels.has(field.name.replace(/^\$+/, '')) ? fieldLabel(field) : metadata.label ?? fieldLabel(field), '\t\t\t').trimEnd(),
	]
	const labelPlural = metadata.labelPlural && !metadata.labelPlural.endsWith('eses') ? metadata.labelPlural : undefined
	const description = fieldDescription(field, metadata)

	if (labelPlural)
		lines.push(writeProperty('labelPlural', labelPlural, '\t\t\t').trimEnd())

	if (description)
		lines.push(writeProperty('description', description, '\t\t\t').trimEnd())

	if (field.kind === 'primitive') {
		lines.push('\t\t\ttype: EntityFieldType.Primitive,')
		lines.push(`\t\t\tprimitiveType: ${primitiveTypeExpression(field.typeText, field)},`)
	} else {
		lines.push(`\t\t\ttype: EntityFieldType.${field.kind === 'entity' ? 'EntityReference' : 'EntitiesReference'},`)
		lines.push(`\t\t\tentityType: EntityType.${referencedEntityType(field.typeText)},`)
	}

	lines.push(`\t\t\tcardinality: EntityFieldCardinality.${field.cardinality},`)
	lines.push('\t\t},')
	return lines.join('\n')
}

const generatedEntityFile = (
	entity: EntityRecord
) => {
	const description = entityDescription(entity)
	const legacySelectors = legacySelectorByFields(entity.name)
	const selectorMembers = new Map<string, string>()

	for (const selector of entity.selectors) {
		const legacySelector = legacySelectors.get(selector.fields.join('+'))
		const fallbackMember = selectorEnumMemberFromFields(selector.fields) || selectorEnumMember(selector.name)
		selectorMembers.set(
			legacySelector?.member ?? fallbackMember,
			legacySelector?.value ?? selector.name
		)

		if (!selectorMembers.has(fallbackMember))
			selectorMembers.set(fallbackMember, selector.name)
	}

	return [
		'import { type } from \'arktype\'',
		'import {',
		'\tEntityFieldCardinality,',
		'\tEntityFieldType,',
		'\ttype EntityDefinition,',
		'} from \'$/schema/$schema.ts\'',
		'import { EntityType } from \'$/schema/EntityType.ts\'',
		...(
			entity.fields.some((field) => field.name === 'coinId' && field.typeText === 'p:enum') ?
				['import { CoinId } from \'$/constants/Coin.ts\'']
			:
				[]
		),
		...(
			entity.fields.some((field) => field.name === 'marketKind' && field.typeText === 'p:enum') ?
				['import { MarketKind } from \'$/constants/Market.ts\'']
			:
				[]
		),
		...(
			entity.fields.some((field) => field.name === '$marketVenue' && field.typeText === 'p:{marketVenueId:enum}') ?
				['import { MarketVenueId } from \'$/constants/MarketVenue.ts\'']
			:
				[]
		),
		...(
			entity.fields.some((field) => field.typeText === 'p:marketAsset') ?
				['import { marketAsset } from \'$/schema/MarketAsset.ts\'']
			:
				[]
		),
		...(
			entity.fields.some((field) => field.typeText.includes('p:evmAddress')) ?
				['import { EvmAddress } from \'$/schema/ZeroExHex.ts\'']
			:
				[]
		),
		...(
			entity.fields.some((field) => (
				field.typeText.includes('p:zeroExHex')
			)) ?
				['import { ZeroExHex } from \'$/schema/ZeroExHex.ts\'']
			:
				[]
		),
		'',
		preserveNonSelectorEnums(entity.name).trimEnd(),
		`export enum ${entity.name}Selector {`,
		...Array.from(selectorMembers).map(([member, value]) => `\t${member} = '${value}',`),
		'}',
		'',
		'export default {',
		`\tentityType: EntityType.${entity.name},`,
		writeProperty('label', entityLabel(entity)).trimEnd(),
		writeProperty('labelPlural', entityLabelPlural(entity)).trimEnd(),
		...(description ? [writeProperty('description', description).trimEnd()] : []),
		'\tselectors: [',
		...entity.selectors.flatMap((selector) => [
			'\t\t{',
			`\t\t\tname: ${entity.name}Selector.${legacySelectors.get(selector.fields.join('+'))?.member ?? (selectorEnumMemberFromFields(selector.fields) || selectorEnumMember(selector.name))},`,
			'\t\t\tfields: [',
			...selector.fields.map((field) => `\t\t\t\t'${field}',`),
			'\t\t\t],',
			'\t\t},',
		]),
		'\t],',
		'\tfields: [',
		...entity.fields.map((field) => generatedField(field, entity.fieldMetadataByName[field.name] ?? {})),
		'\t],',
		'} as const satisfies EntityDefinition',
		'',
	].filter((line) => line !== '').join('\n')
}

const generatedEntityType = (
	entities: EntityRecord[]
) => [
	'export enum EntityType {',
	...entities.map((entity) => `\t${entity.name} = '${entity.name}',`),
	'}',
	'',
].join('\n')

const generatedIndex = (
	entities: EntityRecord[]
) => {
	const chunks = Array.from(
		{ length: Math.ceil(entities.length / 50) },
		(_, index) => entities.slice(index * 50, index * 50 + 50)
	)

	return [
		'import {',
		'\tindexSchema,',
		'\ttype EntityDefinition,',
		'\ttype EntityFieldDefinitions,',
		'\ttype Schema,',
		'} from \'$/schema/$schema.ts\'',
		'',
		...entities.map((entity) => `import ${entity.name}Schema from '$/schema/${entity.name}.ts'`),
		'',
		...chunks.flatMap((chunk, index) => [
			`const schemaChunk${index} = [`,
			...chunk.map((entity) => `\t${entity.name}Schema,`),
			'] as const satisfies Schema',
			'',
		]),
		'type SchemaRegistry = readonly (',
		...chunks.map((_, index) => `\t| (typeof schemaChunk${index})[number]`),
		')[]',
		'',
		'const schemaEntries: EntityDefinition[] = []',
		...chunks.map((_, index) => `schemaEntries.push(...schemaChunk${index})`),
		'',
		'// oxlint-disable-next-line typescript/no-restricted-types -- generated schema registry cast bridges chunked entity definition tuple construction',
		'export const schema = schemaEntries as unknown as SchemaRegistry',
		'',
		'export const schemaMeta = indexSchema(schema)',
		'export const entityDefinitionByType = schemaMeta.entityDefinitionByType',
		'export const entityFieldDefinitionByEntityTypeAndName = schemaMeta.entityFieldDefinitionByEntityTypeAndName',
		'export const entitySelectorDefinitionByEntityTypeAndName = schemaMeta.entitySelectorDefinitionByEntityTypeAndName',
		'',
		'export type SchemaEntityDefinition = typeof schema[number]',
		'',
		'export type SchemaEntityFieldDefinitions<_EntityDefinition extends SchemaEntityDefinition> = EntityFieldDefinitions<_EntityDefinition>',
		'',
	].join('\n')
}

const generatedViewsIndex = (
	entities: EntityRecord[]
) => {
	const entitiesWithViews = entities.filter((entity) => existsSync(join(viewsDirectory, `${entity.name}View.svelte`)))

	return [
		'// Types/constants',
		'import type { Component } from \'svelte\'',
		'import { EntityType } from \'$/schema/EntityType.ts\'',
		'',
		...entitiesWithViews.map((entity) => `import ${entity.name}View from '$/views/${entity.name}View.svelte'`),
		'',
		'',
		'// Constants',
		'export type EntityViewComponent = Component',
		'',
		'export const entityViewByEntityType = {',
		...entitiesWithViews.map((entity) => `\t[EntityType.${entity.name}]: ${entity.name}View,`),
		'} as const satisfies Partial<Record<EntityType, EntityViewComponent>>',
		'',
	].join('\n')
}

const normalizedGeneratedText = (
	text: string
) => `${text.replace(/[ \t]+$/gm, '').replace(/\n*$/, '')}\n`

const generate = (
	entities: EntityRecord[]
) => {
	for (const file of readdirSync(schemaDirectory)) {
		if (generatedSupportFiles.has(file))
			continue

		if (!file.endsWith('.ts'))
			continue

		if (!entities.some((entity) => `${entity.name}.ts` === file))
			rmSync(join(schemaDirectory, file))
	}

	writeFileSync(join(schemaDirectory, 'EntityType.ts'), normalizedGeneratedText(generatedEntityType(entities)))
	writeFileSync(join(schemaDirectory, 'index.ts'), normalizedGeneratedText(generatedIndex(entities)))
	writeFileSync(viewsIndexPath, normalizedGeneratedText(generatedViewsIndex(entities)))

	for (const entity of entities)
		writeFileSync(join(schemaDirectory, `${entity.name}.ts`), normalizedGeneratedText(generatedEntityFile(entity)))
}

const command = process.argv[2] ?? 'sync'
const sourceMarkdown = readFileSync(schemaMarkdownPath, 'utf8')
const entities = parseSchemaMarkdown(sourceMarkdown)

if (!entities.length)
	throw new Error('No entities found in SCHEMA.md')

if (command === 'format' || command === 'sync') {
	const formatted = formatSchemaMarkdown(entities)

	if (sourceMarkdown !== formatted)
		writeFileSync(schemaMarkdownPath, formatted)
}

if (command === 'generate' || command === 'sync')
	generate(parseSchemaMarkdown(readFileSync(schemaMarkdownPath, 'utf8')))

if (command === 'check') {
	const formatted = formatSchemaMarkdown(entities)

	if (sourceMarkdown !== formatted)
		throw new Error('SCHEMA.md is not normalized. Run `pnpm run schema:format`.')

	const before = new Map(readdirSync(schemaDirectory).map((file) => [
		file,
		existsSync(join(schemaDirectory, file)) ? readFileSync(join(schemaDirectory, file), 'utf8') : '',
	]))
	const beforeViewsIndex = existsSync(viewsIndexPath) ? readFileSync(viewsIndexPath, 'utf8') : undefined

	generate(entities)

	for (const file of readdirSync(schemaDirectory)) {
		if ((before.get(file) ?? '') !== readFileSync(join(schemaDirectory, file), 'utf8'))
			throw new Error(`${join('src/schema', basename(file))} is out of sync. Run \`pnpm run schema:generate\`.`)
	}

	if (beforeViewsIndex !== readFileSync(viewsIndexPath, 'utf8'))
		throw new Error('src/views/index.ts is out of sync. Run `pnpm run schema:generate`.')
}
