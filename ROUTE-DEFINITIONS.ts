import {
	EntityFieldType,
	type EntityFieldName,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmBlockSelector } from '$/schema/EvmBlock.ts'
import { EvmLogSelector } from '$/schema/EvmLog.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { EvmTransactionSelector } from '$/schema/EvmTransaction.ts'
import { schema } from '$/schema/index.ts'
import { NetworkSelector } from '$/schema/Network.ts'


export enum RouteScope {
	Public = 'public',
	Local = 'local',
	Test = 'test',
	Api = 'api',
}

export enum RouteSurface {
	Hub = 'hub',
	List = 'list',
	Detail = 'detail',
	Subview = 'subview',
	Tool = 'tool',
	Action = 'action',
	Resource = 'resource',
}

export enum RouteFileKind {
	Page = 'page',
	Layout = 'layout',
	Server = 'server',
	PageModule = 'page-module',
	LayoutModule = 'layout-module',
}

export enum RouteSegmentKind {
	Static = 'static',
	Group = 'group',
	Param = 'param',
	RestParam = 'rest-param',
	RootLayout = 'root-layout',
}

export enum RouteSelectionKind {
	Literal = 'literal',
	Param = 'param',
	ParamTransform = 'param-transform',
	ConstantLookup = 'constant-lookup',
	DevalueParam = 'devalue-param',
	EntitySelector = 'entity-selector',
}

export enum RouteComponentKind {
	Page = 'page',
	EntityView = 'entity-view',
	EntityListView = 'entity-list-view',
	ParentPageCollapsible = 'parent-page-collapsible',
	ResourceBoundary = 'resource-boundary',
	CollapsibleTabs = 'collapsible-tabs',
	Tool = 'tool',
	Custom = 'custom',
}

export enum RoutePathNounForm {
	NonNoun = 'non-noun',
	Plural = 'plural',
	Singular = 'singular',
}

export enum RouteLayoutChromeScope {
	App = 'app',
	Section = 'section',
	Collection = 'collection',
	EntityChildren = 'entity-children',
	Tool = 'tool',
}

export enum RoutePageIsolation {
	Standalone = 'standalone',
	BaseDetailSiblingOfEntityGroup = 'base-detail-sibling-of-entity-group',
	NestedSubviewUnderEntityGroup = 'nested-subview-under-entity-group',
}

export enum RouteMigrationAction {
	MoveBasePageOutOfEntityGroup = 'move-base-page-out-of-entity-group',
	KeepNestedSubviewInEntityGroup = 'keep-nested-subview-in-entity-group',
}

export enum RouteEntityHierarchySource {
	SchemaSelectors = 'schema-selectors',
	SchemaReferences = 'schema-references',
	SelectorEquivalence = 'selector-equivalence',
	RouteParams = 'route-params',
	ParamMatchers = 'param-matchers',
}

export enum RouteSelectorEquivalenceKind {
	Canonical = 'canonical',
	PureTransform = 'pure-transform',
	ResolvedInterop = 'resolved-interop',
}

export enum RouteEntityPlacementKind {
	Root = 'root',
	Section = 'section',
	Collection = 'collection',
	Detail = 'detail',
	Subview = 'subview',
	NestedDetail = 'nested-detail',
}

export enum RouteHierarchyFactOwner {
	RouteHierarchy = 'route-hierarchy',
	Schema = 'schema',
	RouteParams = 'route-params',
	RouteParamMatchers = 'route-param-matchers',
	RouteViews = 'route-views',
	SelectorBuilders = 'selector-builders',
}

export enum RouteGroupId {
	Local = 'local',
	Explore = 'explore',
	Assets = 'assets',
	Social = 'social',
}

export enum RouteId {
	Home = 'home',
	Explore = 'explore',
	Networks = 'networks',
	NetworkEip155 = 'network-eip155',
	NetworkEip155Blocks = 'network-eip155-blocks',
	NetworkEip155Block = 'network-eip155-block',
	NetworkEip155BlockTransactions = 'network-eip155-block-transactions',
	NetworkEip155Transactions = 'network-eip155-transactions',
	NetworkEip155Transaction = 'network-eip155-transaction',
	NetworkEip155TransactionLog = 'network-eip155-transaction-log',
	NetworkEip155Contracts = 'network-eip155-contracts',
	NetworkEip155Blobs = 'network-eip155-blobs',
	NetworkEip155BeaconSlots = 'network-eip155-beacon-slots',
	NetworkEip155Upgrades = 'network-eip155-upgrades',
	NetworkSlug = 'network-slug',
	Contracts = 'contracts',
	Services = 'services',
	Ipfs = 'ipfs',
	Swarm = 'swarm',
	Upgrades = 'upgrades',
	Assets = 'assets',
	Coins = 'coins',
	CoinsPrices = 'coins-prices',
	CoinsCandles = 'coins-candles',
	Coin = 'coin',
	Markets = 'markets',
	Market = 'market',
	MarketVenues = 'market-venues',
	Currencies = 'currencies',
	Pools = 'pools',
	Pool = 'pool',
	Vaults = 'vaults',
	Leverage = 'leverage',
	Channels = 'channels',
	Evm = 'evm',
	EvmCalldata = 'evm-calldata',
	EvmCalldataDecoder = 'evm-calldata-decoder',
	EvmCalldataDetail = 'evm-calldata-detail',
	EvmSelectors = 'evm-selectors',
	EvmTopics = 'evm-topics',
	EvmErrors = 'evm-errors',
	Ens = 'ens',
	EnsName = 'ens-name',
	EnsNameRecords = 'ens-name-records',
	EnsNameResolver = 'ens-name-resolver',
	EnsNameResolvesTo = 'ens-name-resolves-to',
	Proposals = 'proposals',
	ProposalRealm = 'proposal-realm',
	ProposalKind = 'proposal-kind',
	Proposal = 'proposal',
	Social = 'social',
	ActivityPub = 'activitypub',
	Atproto = 'atproto',
	Farcaster = 'farcaster',
	FarcasterAccounts = 'farcaster-accounts',
	FarcasterFeed = 'farcaster-feed',
	FarcasterChannels = 'farcaster-channels',
	FarcasterUsers = 'farcaster-users',
	Lens = 'lens',
	Nostr = 'nostr',
	Reddit = 'reddit',
	Rss = 'rss',
	X = 'x',
	YouTube = 'youtube',
	YouTubeChannels = 'youtube-channels',
	YouTubeVideos = 'youtube-videos',
	YouTubePlaylists = 'youtube-playlists',
	Xmtp = 'xmtp',
	Dashboards = 'dashboards',
	Accounts = 'accounts',
	AccountsConnections = 'accounts-connections',
	AccountsWatchedAccounts = 'accounts-watched-accounts',
	AccountsBalances = 'accounts-balances',
	AccountsAllowances = 'accounts-allowances',
	AccountsPositions = 'accounts-positions',
	AccountsTransactions = 'accounts-transactions',
	Agents = 'agents',
	AgentsConversations = 'agents-conversations',
	AgentConversation = 'agent-conversation',
	Sessions = 'sessions',
	Multiplayer = 'multiplayer',
	Manage = 'manage',
	BridgeRoute = 'bridge-route',
	BridgeRouteStep = 'bridge-route-step',
	Url = 'url',
	WalletConnection = 'wallet-connection',
}

export enum RouteNavigationId {
	Home = 'home',
	Explore = 'explore',
	ExploreNetworks = 'explore-networks',
	ExploreEvm = 'explore-evm',
	ExploreEns = 'explore-ens',
	ExploreProposals = 'explore-proposals',
	Assets = 'assets',
	AssetsCoins = 'assets-coins',
	AssetsMarkets = 'assets-markets',
	AssetsPools = 'assets-pools',
	Social = 'social',
	SocialFarcaster = 'social-farcaster',
	SocialYouTube = 'social-youtube',
	LocalAccounts = 'local-accounts',
	Agents = 'agents',
}

export enum RouteParamName {
	Caip2 = 'caip2',
	NetworkSlug = 'networkSlug',
	Address = 'address',
	BlockNumber = 'blockNumber',
	TransactionId = 'transactionId',
	LogIndex = 'logIndex',
	BlobIndex = 'blobIndex',
	CoinId = 'coinId',
	MarketKey = 'marketKey',
	ChainId = 'chainId',
	PoolId = 'poolId',
	VaultId = 'vaultId',
	EnsName = 'ensName',
	SpecificationRealmSlug = 'specificationRealmSlug',
	ProposalKindSlug = 'proposalKindSlug',
	ProposalRef = 'proposalRef',
	ContentPath = 'contentPath',
	RouteId = 'routeId',
	StepIndex = 'stepIndex',
	Url = 'url',
	WalletId = 'walletId',
	Hex = 'hex',
}

export enum RouteParamMatcher {
	BeaconEpochNumber = 'beaconEpochNumber',
	BeaconSlotNumber = 'beaconSlotNumber',
	BridgeRouteStepIndex = 'bridgeRouteStepIndex',
	Caip2Namespace = 'caip2Namespace',
	Caip2Reference = 'caip2Reference',
	Eip155Caip2Namespace = 'eip155Caip2Namespace',
	Eip155Caip2Reference = 'eip155Caip2Reference',
	Eip155ChainId = 'eip155ChainId',
	Eip155NetworkCaip2 = 'eip155NetworkCaip2',
	EvmAddress = 'evmAddress',
	EvmBlockNumber = 'evmBlockNumber',
	EvmTxHash = 'evmTxHash',
	FarcasterFid = 'farcasterFid',
	Iso4217 = 'iso4217',
	MarketKey = 'marketKey',
	MarketVenueId = 'marketVenueId',
	NetworkCaip2 = 'networkCaip2',
	NetworkSlug = 'networkSlug',
	NonNegativeInteger = 'nonNegativeInteger',
	ProposalKindSlug = 'proposalKindSlug',
	ProposalRef = 'proposalRef',
	SpecificationRealmSlug = 'specificationRealmSlug',
	Test = 'test',
	UserOperationHash = 'userOperationHash',
}

type ViewComponentPath =
	| `$/views/${string}.svelte`
	| `$/views-new/${string}.svelte`
	| `$/views_/${string}.svelte`
	| `$/components/${string}.svelte`

type RouteParam = {
	name: `${RouteParamName}`
	matcher?: `${RouteParamMatcher}`
	rest?: true
	fixture?: string
	entityField?: string
	description?: string
}

type RouteSegment = (
	| {
		kind: RouteSegmentKind.Static
		value: string
	}
	| {
		kind: RouteSegmentKind.Group
		value: string
	}
	| {
		kind: RouteSegmentKind.Param
		name: `${RouteParamName}` | string
		matcher?: `${RouteParamMatcher}` | string
	}
	| {
		kind: RouteSegmentKind.RestParam
		name: `${RouteParamName}` | string
	}
	| {
		kind: RouteSegmentKind.RootLayout
	}
)

type RouteSelection = (
	| {
		kind: RouteSelectionKind.Literal
		value: string | number | boolean
	}
	| {
		kind: RouteSelectionKind.Param
		param: string
	}
	| {
		kind: RouteSelectionKind.ParamTransform
		param: string
		transform: string
	}
	| {
		kind: RouteSelectionKind.ConstantLookup
		source: `$/constants/${string}.ts`
		exportName: string
		key: RouteSelection
		property?: string
	}
	| {
		kind: RouteSelectionKind.DevalueParam
		param: string
		schemaEntity?: `${EntityType}`
	}
	| {
		kind: RouteSelectionKind.EntitySelector
		entity: `${EntityType}`
		selector: Record<string, RouteSelection>
	}
)

type RouteComponent = {
	kind: `${RouteComponentKind}`
	component?: ViewComponentPath
	selection?: RouteSelection
	props?: Record<string, RouteSelection | string | number | boolean>
	children?: readonly RouteComponent[]
}

type RouteEntityBinding<
	_EntityType extends EntityType = EntityType,
> = {
	entity: `${_EntityType}`
	selector?: string
	fields?: readonly string[]
	collection?: string
	sourceWindow?: string
	view?: {
		detail?: ViewComponentPath
		list?: ViewComponentPath
		timestamp?: ViewComponentPath
	}
}

type RouteNavigation = {
	id: `${RouteNavigationId}`
	title: string
	icon?: string
	parent?: `${RouteNavigationId}`
	defaultIsOpen?: boolean
	hidden?: true
}

type RoutePattern = {
	id: `${RouteId}`
	path: `/${string}` | '/'
	file: `src/routes/${string}`
	scope: `${RouteScope}`
	surface: `${RouteSurface}`
	params?: readonly RouteParam[]
	entity?: RouteEntityBinding
	navigation?: RouteNavigation
	children?: readonly `${RouteId}`[]
	tabs?: readonly `${RouteId}`[]
	probe?: `/${string}` | '/'
	notes?: string
}

type RouteLoadDeclaration = {
	imports?: readonly string[]
	parse?: readonly {
		param: string
		parser: string
		errorStatus?: number
		errorMessage?: string
	}[]
	returns: Record<string, RouteSelection>
}

type RouteFile = {
	id: string
	route?: `${RouteId}`
	kind: `${RouteFileKind}`
	file: `src/routes/${string}`
	segments: readonly RouteSegment[]
	urlPath?: `/${string}` | '/'
	params?: readonly RouteParam[]
	load?: RouteLoadDeclaration
	component?: RouteComponent
	notes?: string
}

type RouteFileConvention = {
	id: string
	pathNounForm: `${RoutePathNounForm}`
	layoutChromeScope?: `${RouteLayoutChromeScope}`
	pageIsolation?: `${RoutePageIsolation}`
	examples: readonly `src/routes/${string}`[]
	notes: string
}

type RouteTreeMigrationPlan = {
	id: string
	currentBasePage: `src/routes/${string}/+page.svelte`
	targetBasePage: `src/routes/${string}/+page.svelte`
	currentNestedPages: readonly `src/routes/${string}/+page.svelte`[]
	actions: readonly `${RouteMigrationAction}`[]
	notes: string
}

type RouteSelectorEquivalenceParam = {
	name: string
	matcher?: `${RouteParamMatcher}` | string
}

type RouteSelectorEquivalencePlan = {
	id: string
	entity: `${EntityType}`
	canonicalSelector: string
	equivalentSelector: string
	kind: `${RouteSelectorEquivalenceKind}`
	params: readonly RouteSelectorEquivalenceParam[]
	canonicalExpression: string
	notes: string
}

type RouteEntityPlacementPlan = {
	id: string
	entity: `${EntityType}`
	placement: `${RouteEntityPlacementKind}`
	canonicalSelector?: string
	parentEntity?: `${EntityType}`
	parentSelector?: string
	source: `${RouteEntityHierarchySource}`
	examples: readonly `src/routes/${string}`[]
	notes: string
}

type RouteEntityHierarchyPlacement = {
	entity: `${EntityType}`
	placement: `${RouteEntityPlacementKind}`
	selectors: readonly {
		name: string
		fields: readonly string[]
		parentFields: readonly string[]
	}[]
}

type RouteEntityHierarchyPlan = {
	id: string
	entityCoverage: 'all-schema-entities'
	factOwnership: readonly RouteHierarchyOwnershipPlan[]
	sources: {
		selectors: `${RouteEntityHierarchySource.SchemaSelectors}`
		parentage: `${RouteEntityHierarchySource.SchemaReferences}`
		equivalence: `${RouteEntityHierarchySource.SelectorEquivalence}`
		routeParams: `${RouteEntityHierarchySource.RouteParams}`
		paramMatchers: `${RouteEntityHierarchySource.ParamMatchers}`
	}
	placementOrder: readonly `${RouteEntityPlacementKind}`[]
	model: {
		entity: `${EntityType}`
		selectorEquivalences: readonly RouteSelectorEquivalencePlan[]
		placements: readonly RouteEntityPlacementPlan[]
	}
	notes: string
}

type RouteHierarchyOwnershipPlan = {
	field: string
	owner: `${RouteHierarchyFactOwner}`
	registry?: string
	notes: string
}

type RouteFamily = {
	id: string
	root: readonly RouteSegment[]
	scope: `${RouteScope}`
	hub?: `${RouteId}`
	entity: `${EntityType}`
	defaultView?: ViewComponentPath
	members: readonly {
		id: string
		pathSuffix: readonly RouteSegment[]
		surface: `${RouteSurface}`
		entity?: `${EntityType}`
		view?: ViewComponentPath
		selection?: RouteSelection
		navigation?: RouteNavigation
	}[]
	notes?: string
}

type RouteTopologyContract = {
	family: string
	scope: `${RouteScope}`
	paths: readonly {
		path: `/${string}` | '/'
		surface: `${RouteSurface}`
		entity?: `${EntityType}`
		selector?: string
		notes?: string
	}[]
}

type SimpleEntityPageRoute = {
	file: `src/routes/${string}/+page.svelte`
	entity: `${EntityType}`
	component: string
}

type StaticParentPageLayoutRoute = {
	file: `src/routes/${string}/+layout.svelte`
	title: string
	href: RouteHrefAxis
	id?: RouteIdentityAxis
}

type RouteLocalParamAxis = {
	route: string
	local: string
	value: string
}

type RouteHrefAxis = {
	path: `/${string}`
}

type RouteHrefParamAxis = {
	route: string
	value: string
}

type RouteIdentityAxis = {
	value: string
}

type RouteSelectorFieldAxis = {
	field: string
	value: string
}

type RouteViewComponentAxis = {
	name: string
}

type RouteViewRenderAxis = {
	title?: string
}

type StaticEntityParentPageLayoutRoute = {
	file: `src/routes/${string}/+layout.svelte`
	entity: `${EntityType}`
	component: RouteViewComponentAxis
	href: RouteHrefAxis
	selector: RouteSelectorFieldAxis
}

type ParamEntityParentPageLayoutRoute = {
	file: `src/routes/${string}/+layout.svelte`
	entity: `${EntityType}`
	component: RouteViewComponentAxis
	href: RouteHrefAxis
	param: RouteLocalParamAxis
	hrefParam: RouteHrefParamAxis
	id: RouteIdentityAxis
	selector: RouteSelectorFieldAxis
}

type MultiParamEntityParentPageLayoutRoute = {
	file: `src/routes/${string}/+layout.svelte`
	entity: `${EntityType}`
	component: RouteViewComponentAxis
	href: RouteHrefAxis
	params: readonly (RouteLocalParamAxis & {
		hrefParam: RouteHrefParamAxis
		selector: RouteSelectorFieldAxis
	})[]
	id: RouteIdentityAxis
}

type SpecialParamEntityParentPageLayoutRoute = {
	file: `src/routes/${string}/+layout.svelte`
	entity: `${EntityType}`
	component: RouteViewComponentAxis
	href: RouteHrefAxis
	// Keep param derivation, href serialization, DOM identity, and selector fields separate.
	// They often share a route param, but they are different route axes.
	param: RouteLocalParamAxis
	hrefParam: RouteHrefParamAxis
	id: RouteIdentityAxis
	selector: RouteSelectorFieldAxis
	view?: RouteViewRenderAxis
}

type PropsExpressionEntityParentPageLayoutRoute = {
	file: `src/routes/${string}/+layout.svelte`
	entity: `${EntityType}`
	component: RouteViewComponentAxis
	imports?: readonly string[]
	href: {
		value: string
	}
	id: RouteIdentityAxis
	selector: {
		value: string
	}
	key?: {
		value: string
	}
}

type NetworkNumericEntityParentPageLayoutRoute = {
	file: `src/routes/${string}/+layout.svelte`
	entity: `${EntityType}`
	component: RouteViewComponentAxis
	href: RouteHrefAxis
	selector: {
		local: string
	}
	value: RouteSelectorFieldAxis & {
		route: string
	}
	asConst?: true
}

type RouteGroup = {
	id: `${RouteGroupId}`
	title: string
	root: string
	scope: `${RouteScope}`
	children: readonly `${RouteId}`[]
	notes?: string
}


export const routeVersion = 1

export const routeFileConventions = [
	{
		id: 'plural-collection-page',
		pathNounForm: RoutePathNounForm.Plural,
		layoutChromeScope: RouteLayoutChromeScope.Collection,
		pageIsolation: RoutePageIsolation.Standalone,
		examples: [
			'src/routes/(social)/(youtube)/youtube/channels/+page.svelte',
			'src/routes/(social)/(youtube)/youtube/videos/+page.svelte',
			'src/routes/(social)/(nostr)/nostr/profiles/+page.svelte',
			'src/routes/~/(accounts)/accounts/positions/+page.svelte',
		],
		notes: 'Plural visible paths are collection/list pages. Their section chrome is a navigation/layout axis, not evidence that child entity detail pages belong under the plural page.',
	},
	{
		id: 'singular-base-detail-page',
		pathNounForm: RoutePathNounForm.Singular,
		pageIsolation: RoutePageIsolation.BaseDetailSiblingOfEntityGroup,
		examples: [
			'src/routes/(assets)/(coins)/coin/[coinId]/+page.svelte',
			'src/routes/(social)/(youtube)/youtube/channel/[channelId]/+page.svelte',
			'src/routes/(social)/(youtube)/youtube/video/[videoId]/+page.svelte',
			'src/routes/(social)/(nostr)/nostr/profile/[pubkey]/+page.svelte',
		],
		notes: 'The base detail +page.svelte stays beside the nested singular group. It is not generated inside the group layout that wraps child subviews.',
	},
	{
		id: 'singular-entity-children-layout',
		pathNounForm: RoutePathNounForm.Singular,
		layoutChromeScope: RouteLayoutChromeScope.EntityChildren,
		pageIsolation: RoutePageIsolation.NestedSubviewUnderEntityGroup,
		examples: [
			'src/routes/(assets)/(coins)/coin/[coinId]/(coin)/+layout.svelte',
			'src/routes/(social)/(youtube)/youtube/channel/[channelId]/(channel)/+layout.svelte',
			'src/routes/(social)/(youtube)/youtube/video/[videoId]/(video)/+layout.svelte',
			'src/routes/(social)/(nostr)/nostr/profile/[pubkey]/(profile)/+layout.svelte',
		],
		notes: 'A nested singular group layout owns child navigation and parent summary chrome for subroutes only, such as videos, comments, notes, replies, or transactions.',
	},
] as const satisfies readonly RouteFileConvention[]

export const routeTreeMigrationPlans = [
	{
		id: 'ipfs-resource-base-page-isolation',
		currentBasePage: 'src/routes/(explore)/(ipfs)/ipfs/[namespace]/[target]/(ipfsResource)/+page.svelte',
		targetBasePage: 'src/routes/(explore)/(ipfs)/ipfs/[namespace]/[target]/+page.svelte',
		currentNestedPages: [
			'src/routes/(explore)/(ipfs)/ipfs/[namespace]/[target]/(ipfsResource)/path/[...contentPath]/+page.svelte',
		],
		actions: [
			RouteMigrationAction.MoveBasePageOutOfEntityGroup,
			RouteMigrationAction.KeepNestedSubviewInEntityGroup,
		],
		notes: 'The base IPFS resource page is currently inside the resource group even though it is the visible detail route. Move it beside the group; keep path/[...contentPath] nested so future resource chrome can wrap child paths without wrapping the base page.',
	},
	{
		id: 'swarm-resource-base-page-isolation',
		currentBasePage: 'src/routes/(explore)/(swarm)/swarm/[reference]/(swarmResource)/+page.svelte',
		targetBasePage: 'src/routes/(explore)/(swarm)/swarm/[reference]/+page.svelte',
		currentNestedPages: [
			'src/routes/(explore)/(swarm)/swarm/[reference]/(swarmResource)/path/[...contentPath]/+page.svelte',
		],
		actions: [
			RouteMigrationAction.MoveBasePageOutOfEntityGroup,
			RouteMigrationAction.KeepNestedSubviewInEntityGroup,
		],
		notes: 'The base Swarm resource page has the same misplaced-group shape as IPFS. Move the base detail page out, and leave path/[...contentPath] as the nested subview route.',
	},
] as const satisfies readonly RouteTreeMigrationPlan[]

export const routeEntityHierarchyPlan = {
	id: 'selector-guided-entity-route-hierarchy',
	entityCoverage: 'all-schema-entities',
	factOwnership: [
		{
			field: 'entity',
			owner: RouteHierarchyFactOwner.Schema,
			registry: '$/schema/EntityType.ts',
			notes: 'The route hierarchy references entity types; schema owns the entity catalog.',
		},
		{
			field: 'canonicalSelector',
			owner: RouteHierarchyFactOwner.Schema,
			registry: '$/schema/*.ts selectors',
			notes: 'Selector names and fields come from entity definitions.',
		},
		{
			field: 'parentEntity',
			owner: RouteHierarchyFactOwner.Schema,
			registry: '$/schema/*.ts EntityReference fields',
			notes: 'Parent identity comes from selector fields that reference another entity.',
		},
		{
			field: 'equivalentSelector',
			owner: RouteHierarchyFactOwner.SelectorBuilders,
			registry: '$/lib/caip2.ts and future selector-builder registry',
			notes: 'Route-only encodings transform into canonical schema selectors.',
		},
		{
			field: 'params.name',
			owner: RouteHierarchyFactOwner.RouteParams,
			registry: 'routeParams',
			notes: 'Param names, fixtures, and URL serialization belong to route params.',
		},
		{
			field: 'params.matcher',
			owner: RouteHierarchyFactOwner.RouteParamMatchers,
			registry: 'src/params/*.ts',
			notes: 'Param matchers validate URL segment shape before selector builders receive params.',
		},
		{
			field: 'placement',
			owner: RouteHierarchyFactOwner.RouteHierarchy,
			notes: 'The hierarchy owns collection/detail/subview/nested-detail placement.',
		},
		{
			field: 'examples',
			owner: RouteHierarchyFactOwner.RouteHierarchy,
			notes: 'Examples are migration and audit anchors only.',
		},
		{
			field: 'view',
			owner: RouteHierarchyFactOwner.RouteViews,
			registry: 'routeEntityViewComponents',
			notes: 'Component mappings stay in the existing view registry.',
		},
	],
	sources: {
		selectors: RouteEntityHierarchySource.SchemaSelectors,
		parentage: RouteEntityHierarchySource.SchemaReferences,
		equivalence: RouteEntityHierarchySource.SelectorEquivalence,
		routeParams: RouteEntityHierarchySource.RouteParams,
		paramMatchers: RouteEntityHierarchySource.ParamMatchers,
	},
	placementOrder: [
		RouteEntityPlacementKind.Root,
		RouteEntityPlacementKind.Section,
		RouteEntityPlacementKind.Collection,
		RouteEntityPlacementKind.Detail,
		RouteEntityPlacementKind.Subview,
		RouteEntityPlacementKind.NestedDetail,
	],
	model: {
		entity: EntityType.EvmNetwork,
		selectorEquivalences: [
			{
				id: 'network-caip2-route-selector',
				entity: EntityType.Network,
				canonicalSelector: NetworkSelector.Caip2,
				equivalentSelector: 'caip2RouteParam',
				kind: RouteSelectorEquivalenceKind.PureTransform,
				params: [
					{
						name: 'caip2',
						matcher: RouteParamMatcher.NetworkCaip2,
					},
				],
				canonicalExpression: 'networkSelectorFromCaip2(params.caip2)',
				notes: 'The encoded route segment serializes the schema caip2 selector object.',
			},
			{
				id: 'evm-network-caip2-route-selector',
				entity: EntityType.EvmNetwork,
				canonicalSelector: EvmNetworkSelector.Caip2,
				equivalentSelector: 'eip155Caip2RouteParam',
				kind: RouteSelectorEquivalenceKind.PureTransform,
				params: [
					{
						name: 'caip2',
						matcher: RouteParamMatcher.Eip155NetworkCaip2,
					},
				],
				canonicalExpression: 'eip155NetworkSelectorFromCaip2(params.caip2)',
				notes: 'The EVM route narrows CAIP-2 to the eip155 namespace.',
			},
			{
				id: 'evm-network-chain-id-selector',
				entity: EntityType.EvmNetwork,
				canonicalSelector: EvmNetworkSelector.Caip2,
				equivalentSelector: 'chainId',
				kind: RouteSelectorEquivalenceKind.PureTransform,
				params: [
					{
						name: 'chainId',
						matcher: RouteParamMatcher.Eip155ChainId,
					},
				],
				canonicalExpression: "{ caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } }",
				notes: 'A chain id route param places under the EVM network caip2 selector.',
			},
			{
				id: 'network-slug-to-caip2-selector',
				entity: EntityType.Network,
				canonicalSelector: NetworkSelector.Caip2,
				equivalentSelector: NetworkSelector.Slug,
				kind: RouteSelectorEquivalenceKind.ResolvedInterop,
				params: [
					{
						name: 'networkSlug',
						matcher: RouteParamMatcher.NetworkSlug,
					},
				],
				canonicalExpression: 'resolve Network by slug, then use its caip2 selector when present',
				notes: 'Slug is a schema selector, but CAIP-2 descendants converge on the CAIP-2 placement.',
			},
		],
		placements: [
			{
				id: 'networks-collection',
				entity: EntityType.Network,
				placement: RouteEntityPlacementKind.Collection,
				source: RouteEntityHierarchySource.SchemaSelectors,
				examples: [
					'src/routes/(explore)/(networks)/networks/+page.svelte',
				],
				notes: 'Collection pages are navigation and discovery chrome, not entity identity.',
			},
			{
				id: 'evm-network-detail',
				entity: EntityType.EvmNetwork,
				placement: RouteEntityPlacementKind.Detail,
				canonicalSelector: EvmNetworkSelector.Caip2,
				source: RouteEntityHierarchySource.SchemaSelectors,
				examples: [
					'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/+layout.svelte',
					'src/routes/(explore)/(networks)/network/[caip2=networkCaip2]/+page.svelte',
				],
				notes: 'Selector identity defines the detail node; route params serialize or derive that selector.',
			},
			{
				id: 'evm-network-subviews',
				entity: EntityType.EvmNetwork,
				placement: RouteEntityPlacementKind.Subview,
				canonicalSelector: EvmNetworkSelector.Caip2,
				parentEntity: EntityType.EvmNetwork,
				parentSelector: EvmNetworkSelector.Caip2,
				source: RouteEntityHierarchySource.SchemaSelectors,
				examples: [
					'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blocks/+page.svelte',
					'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/transactions/+page.svelte',
					'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/contracts/+page.svelte',
				],
				notes: 'Subview pages keep the same EvmNetwork selector and expose related fields or lists.',
			},
			{
				id: 'evm-block-detail',
				entity: EntityType.EvmBlock,
				placement: RouteEntityPlacementKind.NestedDetail,
				canonicalSelector: EvmBlockSelector.EvmNetworkBlockNumber,
				parentEntity: EntityType.EvmNetwork,
				parentSelector: EvmNetworkSelector.Caip2,
				source: RouteEntityHierarchySource.SchemaSelectors,
				examples: [
					'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]/+page.svelte',
					'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]/(block)/+layout.svelte',
				],
				notes: 'Child entity placement extends the parent network selector with the block selector field.',
			},
			{
				id: 'evm-transaction-detail',
				entity: EntityType.EvmTransaction,
				placement: RouteEntityPlacementKind.NestedDetail,
				canonicalSelector: EvmTransactionSelector.EvmNetworkTxHash,
				parentEntity: EntityType.EvmNetwork,
				parentSelector: EvmNetworkSelector.Caip2,
				source: RouteEntityHierarchySource.SchemaSelectors,
				examples: [
					'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/+page.svelte',
					'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]/(block)/(transactions)/tx/[transactionId=evmTxHash]/+page.svelte',
				],
				notes: 'Network and block transaction route trees converge on the same transaction selector identity.',
			},
			{
				id: 'evm-log-detail',
				entity: EntityType.EvmLog,
				placement: RouteEntityPlacementKind.NestedDetail,
				canonicalSelector: EvmLogSelector.EvmNetworkTxHashLogIndex,
				parentEntity: EntityType.EvmNetwork,
				parentSelector: EvmNetworkSelector.Caip2,
				source: RouteEntityHierarchySource.SchemaSelectors,
				examples: [
					'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/log/[logIndex=nonNegativeInteger]/+page.svelte',
				],
				notes: 'The route can display logs below transaction chrome without changing schema selector ownership.',
			},
		],
	},
	notes: 'Automated migration should enumerate every schema entity, read selectors before route paths, derive parent placement from entity-reference selector fields, and merge equivalent selector encodings before choosing folders, groups, hrefs, or page/layout boundaries.',
} as const satisfies RouteEntityHierarchyPlan

export const routeEntityHierarchyPlacements = schema.map((entityDefinition) => ({
	entity: entityDefinition.entityType,
	placement: (
		entityDefinition.entityType.startsWith('_Global') ?
			RouteEntityPlacementKind.Root
		: entityDefinition.selectors.some((selector) => (
			selector.fields.some((fieldName) => (
				entityDefinition.fields.some((fieldDefinition) => (
					fieldDefinition.name === fieldName
					&& fieldDefinition.type === EntityFieldType.EntityReference
				))
			))
		)) ?
			RouteEntityPlacementKind.NestedDetail
		:
			RouteEntityPlacementKind.Detail
	),
	selectors: entityDefinition.selectors.map((selector) => ({
		name: selector.name,
		fields: selector.fields,
		parentFields: selector.fields.filter((fieldName) => (
			entityDefinition.fields.some((fieldDefinition) => (
				fieldDefinition.name === fieldName
				&& fieldDefinition.type === EntityFieldType.EntityReference
			))
		)),
	})),
})) satisfies readonly RouteEntityHierarchyPlacement[]

export const routeEntityViewComponents = {
	[EntityType.A2aAgentCard]: {
		detail: '$/views-new/A2aAgentCardView.svelte',
		list: '$/views-new/A2aAgentCardsView.svelte',
	},
	[EntityType.A2aAgentCard_Snapshot]: {
		detail: '$/views-new/A2aAgentCard_SnapshotView.svelte',
		list: '$/views-new/A2aAgentCard_SnapshotsView.svelte',
	},
	[EntityType.A2aAgentInterface]: {
		detail: '$/views-new/A2aAgentInterfaceView.svelte',
		list: '$/views-new/A2aAgentInterfacesView.svelte',
	},
	[EntityType.A2aAgentService]: {
		detail: '$/views-new/A2aAgentServiceView.svelte',
		list: '$/views-new/A2aAgentServicesView.svelte',
	},
	[EntityType.A2aAgentService_Timestamp]: {
		detail: '$/views-new/A2aAgentService_TimestampView.svelte',
		list: '$/views-new/A2aAgentService_TimestampsView.svelte',
	},
	[EntityType.A2aAgentSkill]: {
		detail: '$/views-new/A2aAgentSkillView.svelte',
		list: '$/views-new/A2aAgentSkillsView.svelte',
	},
	[EntityType.A2aArtifact]: {
		detail: '$/views-new/A2aArtifactView.svelte',
		list: '$/views-new/A2aArtifactsView.svelte',
	},
	[EntityType.A2aMessage]: {
		detail: '$/views-new/A2aMessageView.svelte',
		list: '$/views-new/A2aMessagesView.svelte',
	},
	[EntityType.A2aMessagePart]: {
		detail: '$/views-new/A2aMessagePartView.svelte',
		list: '$/views-new/A2aMessagePartsView.svelte',
	},
	[EntityType.A2aPushNotificationConfig]: {
		detail: '$/views-new/A2aPushNotificationConfigView.svelte',
		list: '$/views-new/A2aPushNotificationConfigsView.svelte',
	},
	[EntityType.A2aTask]: {
		detail: '$/views-new/A2aTaskView.svelte',
		list: '$/views-new/A2aTasksView.svelte',
	},
	[EntityType.A2aTaskEvent]: {
		detail: '$/views-new/A2aTaskEventView.svelte',
		list: '$/views-new/A2aTaskEventsView.svelte',
	},
	[EntityType.A2aTask_Timestamp]: {
		detail: '$/views-new/A2aTask_TimestampView.svelte',
		list: '$/views-new/A2aTask_TimestampsView.svelte',
	},
	[EntityType.Account]: {
		detail: '$/views-new/AccountView.svelte',
	},
	[EntityType.AcpAgentProgram]: {
		detail: '$/views-new/AcpAgentProgramView.svelte',
		list: '$/views-new/AcpAgentProgramsView.svelte',
	},
	[EntityType.AcpAgentProgramVersion]: {
		detail: '$/views-new/AcpAgentProgramVersionView.svelte',
		list: '$/views-new/AcpAgentProgramVersionsView.svelte',
	},
	[EntityType.AcpAgentRuntime]: {
		detail: '$/views-new/AcpAgentRuntimeView.svelte',
	},
	[EntityType.AcpAgentRuntime_Timestamp]: {
		detail: '$/views-new/AcpAgentRuntime_TimestampView.svelte',
		list: '$/views-new/AcpAgentRuntime_TimestampsView.svelte',
	},
	[EntityType.AcpFileOperation]: {
		detail: '$/views-new/AcpFileOperationView.svelte',
		list: '$/views-new/AcpFileOperationsView.svelte',
	},
	[EntityType.AcpMessage]: {
		detail: '$/views-new/AcpMessageView.svelte',
		list: '$/views-new/AcpMessagesView.svelte',
	},
	[EntityType.AcpMessagePart]: {
		detail: '$/views-new/AcpMessagePartView.svelte',
		list: '$/views-new/AcpMessagePartsView.svelte',
	},
	[EntityType.AcpPermissionRequest]: {
		detail: '$/views-new/AcpPermissionRequestView.svelte',
		list: '$/views-new/AcpPermissionRequestsView.svelte',
	},
	[EntityType.AcpPromptTurn]: {
		detail: '$/views-new/AcpPromptTurnView.svelte',
		list: '$/views-new/AcpPromptTurnsView.svelte',
	},
	[EntityType.AcpSession]: {
		detail: '$/views-new/AcpSessionView.svelte',
		list: '$/views-new/AcpSessionsView.svelte',
	},
	[EntityType.AcpSessionUpdate]: {
		detail: '$/views-new/AcpSessionUpdateView.svelte',
		list: '$/views-new/AcpSessionUpdatesView.svelte',
	},
	[EntityType.AcpTerminal]: {
		detail: '$/views-new/AcpTerminalView.svelte',
		list: '$/views-new/AcpTerminalsView.svelte',
	},
	[EntityType.AcpTerminal_Timestamp]: {
		detail: '$/views-new/AcpTerminal_TimestampView.svelte',
		list: '$/views-new/AcpTerminal_TimestampsView.svelte',
	},
	[EntityType.AcpToolCall]: {
		detail: '$/views-new/AcpToolCallView.svelte',
		list: '$/views-new/AcpToolCallsView.svelte',
	},
	[EntityType.AcpToolCall_Timestamp]: {
		detail: '$/views-new/AcpToolCall_TimestampView.svelte',
		list: '$/views-new/AcpToolCall_TimestampsView.svelte',
	},
	[EntityType.ActivityPubActor]: {
		detail: '$/views-new/ActivityPubActorView.svelte',
		list: '$/views-new/ActivityPubActorsView.svelte',
	},
	[EntityType.ActivityPubActor_Timestamp]: {
		detail: '$/views-new/ActivityPubActor_TimestampView.svelte',
		list: '$/views-new/ActivityPubActor_TimestampsView.svelte',
	},
	[EntityType.ActivityPubNetwork]: {
		detail: '$/views-new/ActivityPubNetworkView.svelte',
	},
	[EntityType.ActivityPubNote]: {
		detail: '$/views-new/ActivityPubNoteView.svelte',
		list: '$/views-new/ActivityPubNotesView.svelte',
	},
	[EntityType.ActivityPubNote_Timestamp]: {
		detail: '$/views-new/ActivityPubNote_TimestampView.svelte',
		list: '$/views-new/ActivityPubNote_TimestampsView.svelte',
	},
	[EntityType.AgentIdentityClaim]: {
		detail: '$/views-new/AgentIdentityClaimView.svelte',
	},
	[EntityType.AgentPaymentRequirement_Timestamp]: {
		detail: '$/views-new/AgentPaymentRequirement_TimestampView.svelte',
		list: '$/views-new/AgentPaymentRequirement_TimestampsView.svelte',
	},
	[EntityType.AiArtifact]: {
		detail: '$/views-new/AiArtifactView.svelte',
		list: '$/views-new/AiArtifactsView.svelte',
	},
	[EntityType.AiArtifactAttestation]: {
		detail: '$/views-new/AiArtifactAttestationView.svelte',
		list: '$/views-new/AiArtifactAttestationsView.svelte',
	},
	[EntityType.AiBenchmark]: {
		detail: '$/views-new/AiBenchmarkView.svelte',
		list: '$/views-new/AiBenchmarksView.svelte',
	},
	[EntityType.AiDataset]: {
		detail: '$/views-new/AiDatasetView.svelte',
		list: '$/views-new/AiDatasetsView.svelte',
	},
	[EntityType.AiDocument]: {
		detail: '$/views-new/AiDocumentView.svelte',
		list: '$/views-new/AiDocumentsView.svelte',
	},
	[EntityType.AiDocumentClaim]: {
		detail: '$/views-new/AiDocumentClaimView.svelte',
		list: '$/views-new/AiDocumentClaimsView.svelte',
	},
	[EntityType.AiEvaluation_Timestamp]: {
		detail: '$/views-new/AiEvaluation_TimestampView.svelte',
		list: '$/views-new/AiEvaluation_TimestampsView.svelte',
	},
	[EntityType.AiModel]: {
		detail: '$/views-new/AiModelView.svelte',
		list: '$/views-new/AiModelsView.svelte',
	},
	[EntityType.AiModelProvider]: {
		detail: '$/views-new/AiModelProviderView.svelte',
		list: '$/views-new/AiModelProvidersView.svelte',
	},
	[EntityType.AiModelVersion]: {
		detail: '$/views-new/AiModelVersionView.svelte',
		list: '$/views-new/AiModelVersionsView.svelte',
	},
	[EntityType.AiModel_Timestamp]: {
		detail: '$/views-new/AiModel_TimestampView.svelte',
		list: '$/views-new/AiModel_TimestampsView.svelte',
	},
	[EntityType.AiProviderApiOperation]: {
		detail: '$/views-new/AiProviderApiOperationView.svelte',
		list: '$/views-new/AiProviderApiOperationsView.svelte',
	},
	[EntityType.AiProviderApiOperation_Timestamp]: {
		detail: '$/views-new/AiProviderApiOperation_TimestampView.svelte',
		list: '$/views-new/AiProviderApiOperation_TimestampsView.svelte',
	},
	[EntityType.AiProviderCatalogEntry]: {
		detail: '$/views-new/AiProviderCatalogEntryView.svelte',
		list: '$/views-new/AiProviderCatalogEntrysView.svelte',
	},
	[EntityType.AiProviderCatalogEntry_Timestamp]: {
		detail: '$/views-new/AiProviderCatalogEntry_TimestampView.svelte',
		list: '$/views-new/AiProviderCatalogEntry_TimestampsView.svelte',
	},
	[EntityType.AiRelationshipClaim]: {
		detail: '$/views-new/AiRelationshipClaimView.svelte',
	},
	[EntityType.AlgorandAccount]: {
		detail: '$/views-new/AlgorandAccountView.svelte',
		list: '$/views-new/AlgorandAccountsView.svelte',
	},
	[EntityType.AlgorandAccount_Timestamp]: {
		detail: '$/views-new/AlgorandAccount_TimestampView.svelte',
		list: '$/views-new/AlgorandAccount_TimestampsView.svelte',
	},
	[EntityType.AlgorandApplication]: {
		detail: '$/views-new/AlgorandApplicationView.svelte',
		list: '$/views-new/AlgorandApplicationsView.svelte',
	},
	[EntityType.AlgorandApplicationLocalState_Round]: {
		detail: '$/views-new/AlgorandApplicationLocalState_RoundView.svelte',
		list: '$/views-new/AlgorandApplicationLocalState_RoundsView.svelte',
	},
	[EntityType.AlgorandApplication_Timestamp]: {
		detail: '$/views-new/AlgorandApplication_TimestampView.svelte',
		list: '$/views-new/AlgorandApplication_TimestampsView.svelte',
	},
	[EntityType.AlgorandAsset]: {
		detail: '$/views-new/AlgorandAssetView.svelte',
		list: '$/views-new/AlgorandAssetsView.svelte',
	},
	[EntityType.AlgorandAssetHolding_Round]: {
		detail: '$/views-new/AlgorandAssetHolding_RoundView.svelte',
		list: '$/views-new/AlgorandAssetHolding_RoundsView.svelte',
	},
	[EntityType.AlgorandAsset_Timestamp]: {
		detail: '$/views-new/AlgorandAsset_TimestampView.svelte',
		list: '$/views-new/AlgorandAsset_TimestampsView.svelte',
	},
	[EntityType.AlgorandBox]: {
		detail: '$/views-new/AlgorandBoxView.svelte',
		list: '$/views-new/AlgorandBoxsView.svelte',
	},
	[EntityType.AlgorandBox_Round]: {
		detail: '$/views-new/AlgorandBox_RoundView.svelte',
		list: '$/views-new/AlgorandBox_RoundsView.svelte',
	},
	[EntityType.AlgorandNetwork]: {
		detail: '$/views-new/AlgorandNetworkView.svelte',
	},
	[EntityType.AlgorandNetwork_Timestamp]: {
		detail: '$/views-new/AlgorandNetwork_TimestampView.svelte',
		list: '$/views-new/AlgorandNetwork_TimestampsView.svelte',
	},
	[EntityType.AlgorandRound]: {
		detail: '$/views-new/AlgorandRoundView.svelte',
		list: '$/views-new/AlgorandRoundsView.svelte',
	},
	[EntityType.AlgorandTealProgram]: {
		detail: '$/views-new/AlgorandTealProgramView.svelte',
	},
	[EntityType.AlgorandTealProgram_Timestamp]: {
		detail: '$/views-new/AlgorandTealProgram_TimestampView.svelte',
		list: '$/views-new/AlgorandTealProgram_TimestampsView.svelte',
	},
	[EntityType.AlgorandTransaction]: {
		detail: '$/views-new/AlgorandTransactionView.svelte',
		list: '$/views-new/AlgorandTransactionsView.svelte',
	},
	[EntityType.AlgorandTransactionGroup]: {
		detail: '$/views-new/AlgorandTransactionGroupView.svelte',
	},
	[EntityType.AlgorandTransactionProof]: {
		detail: '$/views-new/AlgorandTransactionProofView.svelte',
		list: '$/views-new/AlgorandTransactionProofsView.svelte',
	},
	[EntityType.AptosAccount]: {
		detail: '$/views-new/AptosAccountView.svelte',
		list: '$/views-new/AptosAccountsView.svelte',
	},
	[EntityType.AptosAccountResource]: {
		detail: '$/views-new/AptosAccountResourceView.svelte',
		list: '$/views-new/AptosAccountResourcesView.svelte',
	},
	[EntityType.AptosAccountResource_Timestamp]: {
		detail: '$/views-new/AptosAccountResource_TimestampView.svelte',
		list: '$/views-new/AptosAccountResource_TimestampsView.svelte',
	},
	[EntityType.AptosAccount_Timestamp]: {
		detail: '$/views-new/AptosAccount_TimestampView.svelte',
		list: '$/views-new/AptosAccount_TimestampsView.svelte',
	},
	[EntityType.AptosBlock]: {
		detail: '$/views-new/AptosBlockView.svelte',
		list: '$/views-new/AptosBlocksView.svelte',
	},
	[EntityType.AptosCoinBalance_Timestamp]: {
		detail: '$/views-new/AptosCoinBalance_TimestampView.svelte',
		list: '$/views-new/AptosCoinBalance_TimestampsView.svelte',
	},
	[EntityType.AptosEvent]: {
		detail: '$/views-new/AptosEventView.svelte',
		list: '$/views-new/AptosEventsView.svelte',
	},
	[EntityType.AptosNetwork]: {
		detail: '$/views-new/AptosNetworkView.svelte',
	},
	[EntityType.AptosNetwork_Timestamp]: {
		detail: '$/views-new/AptosNetwork_TimestampView.svelte',
		list: '$/views-new/AptosNetwork_TimestampsView.svelte',
	},
	[EntityType.AptosStateChange]: {
		detail: '$/views-new/AptosStateChangeView.svelte',
		list: '$/views-new/AptosStateChangesView.svelte',
	},
	[EntityType.AptosTableItem]: {
		detail: '$/views-new/AptosTableItemView.svelte',
	},
	[EntityType.AptosTableItem_Timestamp]: {
		detail: '$/views-new/AptosTableItem_TimestampView.svelte',
		list: '$/views-new/AptosTableItem_TimestampsView.svelte',
	},
	[EntityType.AptosTransaction]: {
		detail: '$/views-new/AptosTransactionView.svelte',
		list: '$/views-new/AptosTransactionsView.svelte',
	},
	[EntityType.AptosTransaction_Timestamp]: {
		detail: '$/views-new/AptosTransaction_TimestampView.svelte',
		list: '$/views-new/AptosTransaction_TimestampsView.svelte',
	},
	[EntityType.ArweaveBlock]: {
		detail: '$/views-new/ArweaveBlockView.svelte',
		list: '$/views-new/ArweaveBlocksView.svelte',
	},
	[EntityType.ArweaveNetwork]: {
		detail: '$/views-new/ArweaveNetworkView.svelte',
		list: '$/views-new/ArweaveNetworksView.svelte',
	},
	[EntityType.ArweaveNetwork_Timestamp]: {
		detail: '$/views-new/ArweaveNetwork_TimestampView.svelte',
		list: '$/views-new/ArweaveNetwork_TimestampsView.svelte',
	},
	[EntityType.ArweaveResource]: {
		detail: '$/views-new/ArweaveResourceView.svelte',
		list: '$/views-new/ArweaveResourcesView.svelte',
	},
	[EntityType.ArweaveResource_Timestamp]: {
		detail: '$/views-new/ArweaveResource_TimestampView.svelte',
		list: '$/views-new/ArweaveResource_TimestampsView.svelte',
	},
	[EntityType.ArweaveTransaction]: {
		detail: '$/views-new/ArweaveTransactionView.svelte',
		list: '$/views-new/ArweaveTransactionsView.svelte',
	},
	[EntityType.AssetClass]: {
		detail: '$/views-new/AssetClassView.svelte',
	},
	[EntityType.AssetEligibility]: {
		detail: '$/views-new/AssetEligibilityView.svelte',
	},
	[EntityType.AssetFormatSupport_Timestamp]: {
		detail: '$/views-new/AssetFormatSupport_TimestampView.svelte',
		list: '$/views-new/AssetFormatSupport_TimestampsView.svelte',
	},
	[EntityType.AssetInstance]: {
		detail: '$/views-new/AssetInstanceView.svelte',
		list: '$/views-new/AssetInstancesView.svelte',
	},
	[EntityType.AssetObject]: {
		detail: '$/views-new/AssetObjectView.svelte',
		list: '$/views-new/AssetObjectsView.svelte',
	},
	[EntityType.AssetSupply_LedgerCoordinate]: {
		detail: '$/views-new/AssetSupply_LedgerCoordinateView.svelte',
		list: '$/views-new/AssetSupply_LedgerCoordinatesView.svelte',
	},
	[EntityType.AssetSupply_Timestamp]: {
		detail: '$/views-new/AssetSupply_TimestampView.svelte',
		list: '$/views-new/AssetSupply_TimestampsView.svelte',
	},
	[EntityType.AtprotoActor]: {
		detail: '$/views-new/AtprotoActorView.svelte',
		list: '$/views-new/AtprotoActorsView.svelte',
	},
	[EntityType.AtprotoActor_Timestamp]: {
		detail: '$/views-new/AtprotoActor_TimestampView.svelte',
		list: '$/views-new/AtprotoActor_TimestampsView.svelte',
	},
	[EntityType.AtprotoNetwork]: {
		detail: '$/views-new/AtprotoNetworkView.svelte',
	},
	[EntityType.AtprotoPost]: {
		detail: '$/views-new/AtprotoPostView.svelte',
		list: '$/views-new/AtprotoPostsView.svelte',
	},
	[EntityType.AtprotoPost_Timestamp]: {
		detail: '$/views-new/AtprotoPost_TimestampView.svelte',
		list: '$/views-new/AtprotoPost_TimestampsView.svelte',
	},
	[EntityType.AtprotoRepoCommit]: {
		detail: '$/views-new/AtprotoRepoCommitView.svelte',
		list: '$/views-new/AtprotoRepoCommitsView.svelte',
	},
	[EntityType.AvailAppId]: {
		detail: '$/views-new/AvailAppIdView.svelte',
		list: '$/views-new/AvailAppIdsView.svelte',
	},
	[EntityType.AvailAppId_Timestamp]: {
		detail: '$/views-new/AvailAppId_TimestampView.svelte',
		list: '$/views-new/AvailAppId_TimestampsView.svelte',
	},
	[EntityType.AvailBlock]: {
		detail: '$/views-new/AvailBlockView.svelte',
		list: '$/views-new/AvailBlocksView.svelte',
	},
	[EntityType.AvailDataSubmission]: {
		detail: '$/views-new/AvailDataSubmissionView.svelte',
		list: '$/views-new/AvailDataSubmissionsView.svelte',
	},
	[EntityType.AvailNetwork]: {
		detail: '$/views-new/AvailNetworkView.svelte',
	},
	[EntityType.AvailNetwork_Timestamp]: {
		detail: '$/views-new/AvailNetwork_TimestampView.svelte',
		list: '$/views-new/AvailNetwork_TimestampsView.svelte',
	},
	[EntityType.AvalancheBlockchain]: {
		detail: '$/views-new/AvalancheBlockchainView.svelte',
		list: '$/views-new/AvalancheBlockchainsView.svelte',
	},
	[EntityType.AvalancheDelegator]: {
		detail: '$/views-new/AvalancheDelegatorView.svelte',
		list: '$/views-new/AvalancheDelegatorsView.svelte',
	},
	[EntityType.AvalanchePChainBlock]: {
		detail: '$/views-new/AvalanchePChainBlockView.svelte',
	},
	[EntityType.AvalanchePChainTransaction]: {
		detail: '$/views-new/AvalanchePChainTransactionView.svelte',
		list: '$/views-new/AvalanchePChainTransactionsView.svelte',
	},
	[EntityType.AvalanchePChainTransaction_Timestamp]: {
		detail: '$/views-new/AvalanchePChainTransaction_TimestampView.svelte',
		list: '$/views-new/AvalanchePChainTransaction_TimestampsView.svelte',
	},
	[EntityType.AvalancheSubnet]: {
		detail: '$/views-new/AvalancheSubnetView.svelte',
	},
	[EntityType.AvalancheSubnet_Timestamp]: {
		detail: '$/views-new/AvalancheSubnet_TimestampView.svelte',
		list: '$/views-new/AvalancheSubnet_TimestampsView.svelte',
	},
	[EntityType.AvalancheValidator]: {
		detail: '$/views-new/AvalancheValidatorView.svelte',
		list: '$/views-new/AvalancheValidatorsView.svelte',
	},
	[EntityType.AvalancheValidator_Timestamp]: {
		detail: '$/views-new/AvalancheValidator_TimestampView.svelte',
		list: '$/views-new/AvalancheValidator_TimestampsView.svelte',
	},
	[EntityType.BeaconAttestation]: {
		detail: '$/views-new/BeaconAttestationView.svelte',
		list: '$/views-new/BeaconAttestationsView.svelte',
	},
	[EntityType.BeaconCommittee]: {
		detail: '$/views-new/BeaconCommitteeView.svelte',
		list: '$/views-new/BeaconCommitteesView.svelte',
	},
	[EntityType.BeaconEpoch]: {
		detail: '$/views-new/BeaconEpochView.svelte',
		list: '$/views-new/BeaconEpochsView.svelte',
	},
	[EntityType.BeaconSlashing]: {
		detail: '$/views-new/BeaconSlashingView.svelte',
		list: '$/views-new/BeaconSlashingsView.svelte',
	},
	[EntityType.BeaconSlot]: {
		detail: '$/views-new/BeaconSlotView.svelte',
		list: '$/views-new/BeaconSlotsView.svelte',
	},
	[EntityType.BeaconSyncCommittee]: {
		detail: '$/views-new/BeaconSyncCommitteeView.svelte',
		list: '$/views-new/BeaconSyncCommitteesView.svelte',
	},
	[EntityType.BeaconValidator]: {
		detail: '$/views-new/BeaconValidatorView.svelte',
		list: '$/views-new/BeaconValidatorsView.svelte',
	},
	[EntityType.BeaconValidator_Timestamp]: {
		detail: '$/views-new/BeaconValidator_TimestampView.svelte',
		list: '$/views-new/BeaconValidator_TimestampsView.svelte',
	},
	[EntityType.BeaconWithdrawal]: {
		detail: '$/views-new/BeaconWithdrawalView.svelte',
		list: '$/views-new/BeaconWithdrawalsView.svelte',
	},
	[EntityType.BitTorrentAnnounce_Timestamp]: {
		detail: '$/views-new/BitTorrentAnnounce_TimestampView.svelte',
		list: '$/views-new/BitTorrentAnnounce_TimestampsView.svelte',
	},
	[EntityType.BitTorrentDhtLookup_Timestamp]: {
		detail: '$/views-new/BitTorrentDhtLookup_TimestampView.svelte',
	},
	[EntityType.BitTorrentDhtNode_Timestamp]: {
		detail: '$/views-new/BitTorrentDhtNode_TimestampView.svelte',
	},
	[EntityType.BitTorrentFile]: {
		detail: '$/views-new/BitTorrentFileView.svelte',
		list: '$/views-new/BitTorrentFilesView.svelte',
	},
	[EntityType.BitTorrentFileTreeEntry]: {
		detail: '$/views-new/BitTorrentFileTreeEntryView.svelte',
		list: '$/views-new/BitTorrentFileTreeEntrysView.svelte',
	},
	[EntityType.BitTorrentMetainfo]: {
		detail: '$/views-new/BitTorrentMetainfoView.svelte',
	},
	[EntityType.BitTorrentPeer_Timestamp]: {
		detail: '$/views-new/BitTorrentPeer_TimestampView.svelte',
	},
	[EntityType.BitTorrentPiece]: {
		detail: '$/views-new/BitTorrentPieceView.svelte',
		list: '$/views-new/BitTorrentPiecesView.svelte',
	},
	[EntityType.BitTorrentSwarmObservation_Timestamp]: {
		detail: '$/views-new/BitTorrentSwarmObservation_TimestampView.svelte',
		list: '$/views-new/BitTorrentSwarmObservation_TimestampsView.svelte',
	},
	[EntityType.BitTorrentTracker]: {
		detail: '$/views-new/BitTorrentTrackerView.svelte',
		list: '$/views-new/BitTorrentTrackersView.svelte',
	},
	[EntityType.BitTorrentTrackerScrape_Timestamp]: {
		detail: '$/views-new/BitTorrentTrackerScrape_TimestampView.svelte',
		list: '$/views-new/BitTorrentTrackerScrape_TimestampsView.svelte',
	},
	[EntityType.BitcoinCashBcmrMetadata]: {
		detail: '$/views-new/BitcoinCashBcmrMetadataView.svelte',
	},
	[EntityType.BitcoinCashCashTokenCategory]: {
		detail: '$/views-new/BitcoinCashCashTokenCategoryView.svelte',
	},
	[EntityType.BitcoinCashCashTokenCommitment]: {
		detail: '$/views-new/BitcoinCashCashTokenCommitmentView.svelte',
	},
	[EntityType.BitcoinCashCashTokenFungibleAmount]: {
		detail: '$/views-new/BitcoinCashCashTokenFungibleAmountView.svelte',
	},
	[EntityType.BitcoinCashCashTokenNft]: {
		detail: '$/views-new/BitcoinCashCashTokenNftView.svelte',
	},
	[EntityType.BittensorBlock]: {
		detail: '$/views-new/BittensorBlockView.svelte',
		list: '$/views-new/BittensorBlocksView.svelte',
	},
	[EntityType.BittensorMetagraph_Timestamp]: {
		detail: '$/views-new/BittensorMetagraph_TimestampView.svelte',
		list: '$/views-new/BittensorMetagraph_TimestampsView.svelte',
	},
	[EntityType.BittensorNetwork]: {
		detail: '$/views-new/BittensorNetworkView.svelte',
	},
	[EntityType.BittensorNetwork_Timestamp]: {
		detail: '$/views-new/BittensorNetwork_TimestampView.svelte',
		list: '$/views-new/BittensorNetwork_TimestampsView.svelte',
	},
	[EntityType.BittensorNeuron]: {
		detail: '$/views-new/BittensorNeuronView.svelte',
		list: '$/views-new/BittensorNeuronsView.svelte',
	},
	[EntityType.BittensorSubnet]: {
		detail: '$/views-new/BittensorSubnetView.svelte',
		list: '$/views-new/BittensorSubnetsView.svelte',
	},
	[EntityType.BlockheadActionOutcome]: {
		detail: '$/views-new/BlockheadActionOutcomeView.svelte',
		list: '$/views-new/BlockheadActionOutcomesView.svelte',
	},
	[EntityType.BlockheadActionOutcome_Timestamp]: {
		detail: '$/views-new/BlockheadActionOutcome_TimestampView.svelte',
		list: '$/views-new/BlockheadActionOutcome_TimestampsView.svelte',
	},
	[EntityType.BlockheadActionReadinessCheck]: {
		detail: '$/views-new/BlockheadActionReadinessCheckView.svelte',
		list: '$/views-new/BlockheadActionReadinessChecksView.svelte',
	},
	[EntityType.BlockheadActionReadinessCheck_Timestamp]: {
		detail: '$/views-new/BlockheadActionReadinessCheck_TimestampView.svelte',
		list: '$/views-new/BlockheadActionReadinessCheck_TimestampsView.svelte',
	},
	[EntityType.BlockheadAgentConnection]: {
		detail: '$/views-new/BlockheadAgentConnectionView.svelte',
	},
	[EntityType.BlockheadAgentConnection_Timestamp]: {
		detail: '$/views-new/BlockheadAgentConnection_TimestampView.svelte',
		list: '$/views-new/BlockheadAgentConnection_TimestampsView.svelte',
	},
	[EntityType.BlockheadAgentConversation]: {
		detail: '$/views-new/BlockheadAgentConversationView.svelte',
		list: '$/views-new/BlockheadAgentConversationsView.svelte',
	},
	[EntityType.BlockheadAgentConversationTurn]: {
		detail: '$/views-new/BlockheadAgentConversationTurnView.svelte',
		list: '$/views-new/BlockheadAgentConversationTurnsView.svelte',
	},
	[EntityType.BlockheadAgentCredentialState]: {
		detail: '$/views-new/BlockheadAgentCredentialStateView.svelte',
	},
	[EntityType.BlockheadAgentCredentialState_Timestamp]: {
		detail: '$/views-new/BlockheadAgentCredentialState_TimestampView.svelte',
		list: '$/views-new/BlockheadAgentCredentialState_TimestampsView.svelte',
	},
	[EntityType.BlockheadAgentProfile]: {
		detail: '$/views-new/BlockheadAgentProfileView.svelte',
		list: '$/views-new/BlockheadAgentProfilesView.svelte',
	},
	[EntityType.BlockheadAgentProgramInstall]: {
		detail: '$/views-new/BlockheadAgentProgramInstallView.svelte',
	},
	[EntityType.BlockheadAgentProgramInstall_Timestamp]: {
		detail: '$/views-new/BlockheadAgentProgramInstall_TimestampView.svelte',
		list: '$/views-new/BlockheadAgentProgramInstall_TimestampsView.svelte',
	},
	[EntityType.BlockheadAgentProviderCall]: {
		detail: '$/views-new/BlockheadAgentProviderCallView.svelte',
		list: '$/views-new/BlockheadAgentProviderCallsView.svelte',
	},
	[EntityType.BlockheadAlgorandParticipationKey]: {
		detail: '$/views-new/BlockheadAlgorandParticipationKeyView.svelte',
		list: '$/views-new/BlockheadAlgorandParticipationKeysView.svelte',
	},
	[EntityType.BlockheadAlgorandPendingTransaction]: {
		detail: '$/views-new/BlockheadAlgorandPendingTransactionView.svelte',
	},
	[EntityType.BlockheadAvalancheNodeState]: {
		detail: '$/views-new/BlockheadAvalancheNodeStateView.svelte',
	},
	[EntityType.BlockheadAvalancheNodeState_Timestamp]: {
		detail: '$/views-new/BlockheadAvalancheNodeState_TimestampView.svelte',
		list: '$/views-new/BlockheadAvalancheNodeState_TimestampsView.svelte',
	},
	[EntityType.BlockheadBitTorrentClientState]: {
		detail: '$/views-new/BlockheadBitTorrentClientStateView.svelte',
	},
	[EntityType.BlockheadBitTorrentClientState_Timestamp]: {
		detail: '$/views-new/BlockheadBitTorrentClientState_TimestampView.svelte',
		list: '$/views-new/BlockheadBitTorrentClientState_TimestampsView.svelte',
	},
	[EntityType.BlockheadBitTorrentTransfer_Timestamp]: {
		detail: '$/views-new/BlockheadBitTorrentTransfer_TimestampView.svelte',
		list: '$/views-new/BlockheadBitTorrentTransfer_TimestampsView.svelte',
	},
	[EntityType.BlockheadBridgeIntent]: {
		detail: '$/views-new/BlockheadBridgeIntentView.svelte',
	},
	[EntityType.BlockheadBridgeTransaction]: {
		detail: '$/views-new/BlockheadBridgeTransactionView.svelte',
		list: '$/views-new/BlockheadBridgeTransactionsView.svelte',
	},
	[EntityType.BlockheadCashuMeltQuote]: {
		detail: '$/views-new/BlockheadCashuMeltQuoteView.svelte',
		list: '$/views-new/BlockheadCashuMeltQuotesView.svelte',
	},
	[EntityType.BlockheadCashuMeltQuote_Timestamp]: {
		detail: '$/views-new/BlockheadCashuMeltQuote_TimestampView.svelte',
		list: '$/views-new/BlockheadCashuMeltQuote_TimestampsView.svelte',
	},
	[EntityType.BlockheadCashuMintQuote]: {
		detail: '$/views-new/BlockheadCashuMintQuoteView.svelte',
		list: '$/views-new/BlockheadCashuMintQuotesView.svelte',
	},
	[EntityType.BlockheadCashuMintQuote_Timestamp]: {
		detail: '$/views-new/BlockheadCashuMintQuote_TimestampView.svelte',
		list: '$/views-new/BlockheadCashuMintQuote_TimestampsView.svelte',
	},
	[EntityType.BlockheadCashuProof]: {
		detail: '$/views-new/BlockheadCashuProofView.svelte',
		list: '$/views-new/BlockheadCashuProofsView.svelte',
	},
	[EntityType.BlockheadCashuProof_Timestamp]: {
		detail: '$/views-new/BlockheadCashuProof_TimestampView.svelte',
		list: '$/views-new/BlockheadCashuProof_TimestampsView.svelte',
	},
	[EntityType.BlockheadCashuToken]: {
		detail: '$/views-new/BlockheadCashuTokenView.svelte',
		list: '$/views-new/BlockheadCashuTokensView.svelte',
	},
	[EntityType.BlockheadCashuWalletState]: {
		detail: '$/views-new/BlockheadCashuWalletStateView.svelte',
	},
	[EntityType.BlockheadCashuWalletState_Timestamp]: {
		detail: '$/views-new/BlockheadCashuWalletState_TimestampView.svelte',
		list: '$/views-new/BlockheadCashuWalletState_TimestampsView.svelte',
	},
	[EntityType.BlockheadCodexStorageNodeState]: {
		detail: '$/views-new/BlockheadCodexStorageNodeStateView.svelte',
	},
	[EntityType.BlockheadCodexStorageNodeState_Timestamp]: {
		detail: '$/views-new/BlockheadCodexStorageNodeState_TimestampView.svelte',
		list: '$/views-new/BlockheadCodexStorageNodeState_TimestampsView.svelte',
	},
	[EntityType.BlockheadCodexStoredData]: {
		detail: '$/views-new/BlockheadCodexStoredDataView.svelte',
		list: '$/views-new/BlockheadCodexStoredDatasView.svelte',
	},
	[EntityType.BlockheadCodexStoredData_Timestamp]: {
		detail: '$/views-new/BlockheadCodexStoredData_TimestampView.svelte',
		list: '$/views-new/BlockheadCodexStoredData_TimestampsView.svelte',
	},
	[EntityType.BlockheadEnsNameSearch]: {
		detail: '$/views-new/BlockheadEnsNameSearchView.svelte',
	},
	[EntityType.BlockheadFarcasterAccountConnection]: {
		detail: '$/views-new/BlockheadFarcasterAccountConnectionView.svelte',
		list: '$/views-new/BlockheadFarcasterAccountConnectionsView.svelte',
	},
	[EntityType.BlockheadFedimintClientState]: {
		detail: '$/views-new/BlockheadFedimintClientStateView.svelte',
	},
	[EntityType.BlockheadFedimintClientState_Timestamp]: {
		detail: '$/views-new/BlockheadFedimintClientState_TimestampView.svelte',
		list: '$/views-new/BlockheadFedimintClientState_TimestampsView.svelte',
	},
	[EntityType.BlockheadFilecoinPendingMessage]: {
		detail: '$/views-new/BlockheadFilecoinPendingMessageView.svelte',
	},
	[EntityType.BlockheadIntentInvocation]: {
		detail: '$/views-new/BlockheadIntentInvocationView.svelte',
		list: '$/views-new/BlockheadIntentInvocationsView.svelte',
	},
	[EntityType.BlockheadIntentOrder]: {
		detail: '$/views-new/BlockheadIntentOrderView.svelte',
		list: '$/views-new/BlockheadIntentOrdersView.svelte',
	},
	[EntityType.BlockheadIntentOrder_Timestamp]: {
		detail: '$/views-new/BlockheadIntentOrder_TimestampView.svelte',
		list: '$/views-new/BlockheadIntentOrder_TimestampsView.svelte',
	},
	[EntityType.BlockheadIntentQuote]: {
		detail: '$/views-new/BlockheadIntentQuoteView.svelte',
		list: '$/views-new/BlockheadIntentQuotesView.svelte',
	},
	[EntityType.BlockheadIntentQuote_Timestamp]: {
		detail: '$/views-new/BlockheadIntentQuote_TimestampView.svelte',
		list: '$/views-new/BlockheadIntentQuote_TimestampsView.svelte',
	},
	[EntityType.BlockheadKaspaNodeState]: {
		detail: '$/views-new/BlockheadKaspaNodeStateView.svelte',
	},
	[EntityType.BlockheadKaspaNodeState_Timestamp]: {
		detail: '$/views-new/BlockheadKaspaNodeState_TimestampView.svelte',
		list: '$/views-new/BlockheadKaspaNodeState_TimestampsView.svelte',
	},
	[EntityType.BlockheadLightningChannelState]: {
		detail: '$/views-new/BlockheadLightningChannelStateView.svelte',
		list: '$/views-new/BlockheadLightningChannelStatesView.svelte',
	},
	[EntityType.BlockheadLightningChannelState_Timestamp]: {
		detail: '$/views-new/BlockheadLightningChannelState_TimestampView.svelte',
		list: '$/views-new/BlockheadLightningChannelState_TimestampsView.svelte',
	},
	[EntityType.BlockheadLightningHtlc]: {
		detail: '$/views-new/BlockheadLightningHtlcView.svelte',
		list: '$/views-new/BlockheadLightningHtlcsView.svelte',
	},
	[EntityType.BlockheadLightningInvoice]: {
		detail: '$/views-new/BlockheadLightningInvoiceView.svelte',
		list: '$/views-new/BlockheadLightningInvoicesView.svelte',
	},
	[EntityType.BlockheadLightningInvoice_Timestamp]: {
		detail: '$/views-new/BlockheadLightningInvoice_TimestampView.svelte',
		list: '$/views-new/BlockheadLightningInvoice_TimestampsView.svelte',
	},
	[EntityType.BlockheadLightningNodeState]: {
		detail: '$/views-new/BlockheadLightningNodeStateView.svelte',
		list: '$/views-new/BlockheadLightningNodeStatesView.svelte',
	},
	[EntityType.BlockheadLightningNodeState_Timestamp]: {
		detail: '$/views-new/BlockheadLightningNodeState_TimestampView.svelte',
		list: '$/views-new/BlockheadLightningNodeState_TimestampsView.svelte',
	},
	[EntityType.BlockheadLightningPayment]: {
		detail: '$/views-new/BlockheadLightningPaymentView.svelte',
		list: '$/views-new/BlockheadLightningPaymentsView.svelte',
	},
	[EntityType.BlockheadLightningPayment_Timestamp]: {
		detail: '$/views-new/BlockheadLightningPayment_TimestampView.svelte',
		list: '$/views-new/BlockheadLightningPayment_TimestampsView.svelte',
	},
	[EntityType.BlockheadLitecoinMwebOutputState]: {
		detail: '$/views-new/BlockheadLitecoinMwebOutputStateView.svelte',
		list: '$/views-new/BlockheadLitecoinMwebOutputStatesView.svelte',
	},
	[EntityType.BlockheadLitecoinMwebOutputState_Timestamp]: {
		detail: '$/views-new/BlockheadLitecoinMwebOutputState_TimestampView.svelte',
		list: '$/views-new/BlockheadLitecoinMwebOutputState_TimestampsView.svelte',
	},
	[EntityType.BlockheadLitecoinMwebWalletState]: {
		detail: '$/views-new/BlockheadLitecoinMwebWalletStateView.svelte',
	},
	[EntityType.BlockheadLitecoinMwebWalletState_Timestamp]: {
		detail: '$/views-new/BlockheadLitecoinMwebWalletState_TimestampView.svelte',
		list: '$/views-new/BlockheadLitecoinMwebWalletState_TimestampsView.svelte',
	},
	[EntityType.BlockheadLogosBlockchainNodeState]: {
		detail: '$/views-new/BlockheadLogosBlockchainNodeStateView.svelte',
	},
	[EntityType.BlockheadLogosBlockchainNodeState_Timestamp]: {
		detail: '$/views-new/BlockheadLogosBlockchainNodeState_TimestampView.svelte',
		list: '$/views-new/BlockheadLogosBlockchainNodeState_TimestampsView.svelte',
	},
	[EntityType.BlockheadLogosBlockchainWalletKeyState]: {
		detail: '$/views-new/BlockheadLogosBlockchainWalletKeyStateView.svelte',
	},
	[EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp]: {
		detail: '$/views-new/BlockheadLogosBlockchainWalletKeyState_TimestampView.svelte',
		list: '$/views-new/BlockheadLogosBlockchainWalletKeyState_TimestampsView.svelte',
	},
	[EntityType.BlockheadMoneroOutputState]: {
		detail: '$/views-new/BlockheadMoneroOutputStateView.svelte',
		list: '$/views-new/BlockheadMoneroOutputStatesView.svelte',
	},
	[EntityType.BlockheadMoneroOutputState_Timestamp]: {
		detail: '$/views-new/BlockheadMoneroOutputState_TimestampView.svelte',
		list: '$/views-new/BlockheadMoneroOutputState_TimestampsView.svelte',
	},
	[EntityType.BlockheadMoneroSubaddressState]: {
		detail: '$/views-new/BlockheadMoneroSubaddressStateView.svelte',
		list: '$/views-new/BlockheadMoneroSubaddressStatesView.svelte',
	},
	[EntityType.BlockheadMoneroSubaddressState_Timestamp]: {
		detail: '$/views-new/BlockheadMoneroSubaddressState_TimestampView.svelte',
		list: '$/views-new/BlockheadMoneroSubaddressState_TimestampsView.svelte',
	},
	[EntityType.BlockheadMoneroTransferState]: {
		detail: '$/views-new/BlockheadMoneroTransferStateView.svelte',
		list: '$/views-new/BlockheadMoneroTransferStatesView.svelte',
	},
	[EntityType.BlockheadMoneroTransferState_Timestamp]: {
		detail: '$/views-new/BlockheadMoneroTransferState_TimestampView.svelte',
		list: '$/views-new/BlockheadMoneroTransferState_TimestampsView.svelte',
	},
	[EntityType.BlockheadMoneroWalletState]: {
		detail: '$/views-new/BlockheadMoneroWalletStateView.svelte',
	},
	[EntityType.BlockheadMoneroWalletState_Timestamp]: {
		detail: '$/views-new/BlockheadMoneroWalletState_TimestampView.svelte',
		list: '$/views-new/BlockheadMoneroWalletState_TimestampsView.svelte',
	},
	[EntityType.BlockheadPanelTree]: {
		detail: '$/views-new/BlockheadPanelTreeView.svelte',
		list: '$/views-new/BlockheadPanelTreesView.svelte',
	},
	[EntityType.BlockheadPayjoinSession]: {
		detail: '$/views-new/BlockheadPayjoinSessionView.svelte',
		list: '$/views-new/BlockheadPayjoinSessionsView.svelte',
	},
	[EntityType.BlockheadQuilibriumAccountState]: {
		detail: '$/views-new/BlockheadQuilibriumAccountStateView.svelte',
		list: '$/views-new/BlockheadQuilibriumAccountStatesView.svelte',
	},
	[EntityType.BlockheadQuilibriumAccountState_Timestamp]: {
		detail: '$/views-new/BlockheadQuilibriumAccountState_TimestampView.svelte',
		list: '$/views-new/BlockheadQuilibriumAccountState_TimestampsView.svelte',
	},
	[EntityType.BlockheadQuilibriumNodeState]: {
		detail: '$/views-new/BlockheadQuilibriumNodeStateView.svelte',
	},
	[EntityType.BlockheadQuilibriumNodeState_Timestamp]: {
		detail: '$/views-new/BlockheadQuilibriumNodeState_TimestampView.svelte',
		list: '$/views-new/BlockheadQuilibriumNodeState_TimestampsView.svelte',
	},
	[EntityType.BlockheadQuilibriumPendingTransaction]: {
		detail: '$/views-new/BlockheadQuilibriumPendingTransactionView.svelte',
		list: '$/views-new/BlockheadQuilibriumPendingTransactionsView.svelte',
	},
	[EntityType.BlockheadRadicleNodeInventory_Timestamp]: {
		detail: '$/views-new/BlockheadRadicleNodeInventory_TimestampView.svelte',
		list: '$/views-new/BlockheadRadicleNodeInventory_TimestampsView.svelte',
	},
	[EntityType.BlockheadRadicleNodeState]: {
		detail: '$/views-new/BlockheadRadicleNodeStateView.svelte',
	},
	[EntityType.BlockheadRadicleNodeState_Timestamp]: {
		detail: '$/views-new/BlockheadRadicleNodeState_TimestampView.svelte',
		list: '$/views-new/BlockheadRadicleNodeState_TimestampsView.svelte',
	},
	[EntityType.BlockheadRadiclePeer]: {
		detail: '$/views-new/BlockheadRadiclePeerView.svelte',
		list: '$/views-new/BlockheadRadiclePeersView.svelte',
	},
	[EntityType.BlockheadRadicleSeedObservation_Timestamp]: {
		detail: '$/views-new/BlockheadRadicleSeedObservation_TimestampView.svelte',
		list: '$/views-new/BlockheadRadicleSeedObservation_TimestampsView.svelte',
	},
	[EntityType.BlockheadRadicleSyncSession]: {
		detail: '$/views-new/BlockheadRadicleSyncSessionView.svelte',
		list: '$/views-new/BlockheadRadicleSyncSessionsView.svelte',
	},
	[EntityType.BlockheadRoom]: {
		detail: '$/views-new/BlockheadRoomView.svelte',
		list: '$/views-new/BlockheadRoomsView.svelte',
	},
	[EntityType.BlockheadRoomPeer]: {
		detail: '$/views-new/BlockheadRoomPeerView.svelte',
		list: '$/views-new/BlockheadRoomPeersView.svelte',
	},
	[EntityType.BlockheadSession]: {
		detail: '$/views-new/BlockheadSessionView.svelte',
		list: '$/views-new/BlockheadSessionsView.svelte',
	},
	[EntityType.BlockheadSessionAction]: {
		detail: '$/views-new/BlockheadSessionActionView.svelte',
		list: '$/views-new/BlockheadSessionActionsView.svelte',
	},
	[EntityType.BlockheadSessionSimulation]: {
		detail: '$/views-new/BlockheadSessionSimulationView.svelte',
		list: '$/views-new/BlockheadSessionSimulationsView.svelte',
	},
	[EntityType.BlockheadSessionSimulationCall]: {
		detail: '$/views-new/BlockheadSessionSimulationCallView.svelte',
		list: '$/views-new/BlockheadSessionSimulationCallsView.svelte',
	},
	[EntityType.BlockheadSessionSimulationLog]: {
		detail: '$/views-new/BlockheadSessionSimulationLogView.svelte',
		list: '$/views-new/BlockheadSessionSimulationLogsView.svelte',
	},
	[EntityType.BlockheadSharedAddress]: {
		detail: '$/views-new/BlockheadSharedAddressView.svelte',
		list: '$/views-new/BlockheadSharedAddresssView.svelte',
	},
	[EntityType.BlockheadSiweChallenge]: {
		detail: '$/views-new/BlockheadSiweChallengeView.svelte',
	},
	[EntityType.BlockheadSocialPostSession]: {
		detail: '$/views-new/BlockheadSocialPostSessionView.svelte',
	},
	[EntityType.BlockheadSource]: {
		detail: '$/views-new/BlockheadSourceView.svelte',
		list: '$/views-new/BlockheadSourcesView.svelte',
	},
	[EntityType.BlockheadSource_Timestamp]: {
		detail: '$/views-new/BlockheadSource_TimestampView.svelte',
		list: '$/views-new/BlockheadSource_TimestampsView.svelte',
	},
	[EntityType.BlockheadStateChannel]: {
		detail: '$/views-new/BlockheadStateChannelView.svelte',
		list: '$/views-new/BlockheadStateChannelsView.svelte',
	},
	[EntityType.BlockheadStateChannelDeposit]: {
		detail: '$/views-new/BlockheadStateChannelDepositView.svelte',
		list: '$/views-new/BlockheadStateChannelDepositsView.svelte',
	},
	[EntityType.BlockheadStateChannelDeposit_Timestamp]: {
		detail: '$/views-new/BlockheadStateChannelDeposit_TimestampView.svelte',
		list: '$/views-new/BlockheadStateChannelDeposit_TimestampsView.svelte',
	},
	[EntityType.BlockheadStateChannelState]: {
		detail: '$/views-new/BlockheadStateChannelStateView.svelte',
		list: '$/views-new/BlockheadStateChannelStatesView.svelte',
	},
	[EntityType.BlockheadStateChannelTransfer]: {
		detail: '$/views-new/BlockheadStateChannelTransferView.svelte',
		list: '$/views-new/BlockheadStateChannelTransfersView.svelte',
	},
	[EntityType.BlockheadStateChannel_Timestamp]: {
		detail: '$/views-new/BlockheadStateChannel_TimestampView.svelte',
		list: '$/views-new/BlockheadStateChannel_TimestampsView.svelte',
	},
	[EntityType.BlockheadSwapIntent]: {
		detail: '$/views-new/BlockheadSwapIntentView.svelte',
	},
	[EntityType.BlockheadTransferIntent]: {
		detail: '$/views-new/BlockheadTransferIntentView.svelte',
	},
	[EntityType.BlockheadTransferRequest]: {
		detail: '$/views-new/BlockheadTransferRequestView.svelte',
	},
	[EntityType.BlockheadWakuMessageObservation_Timestamp]: {
		detail: '$/views-new/BlockheadWakuMessageObservation_TimestampView.svelte',
		list: '$/views-new/BlockheadWakuMessageObservation_TimestampsView.svelte',
	},
	[EntityType.BlockheadWakuNodeState]: {
		detail: '$/views-new/BlockheadWakuNodeStateView.svelte',
	},
	[EntityType.BlockheadWakuNodeState_Timestamp]: {
		detail: '$/views-new/BlockheadWakuNodeState_TimestampView.svelte',
		list: '$/views-new/BlockheadWakuNodeState_TimestampsView.svelte',
	},
	[EntityType.BlockheadWallet]: {
		detail: '$/views-new/BlockheadWalletView.svelte',
		list: '$/views-new/BlockheadWalletsView.svelte',
	},
	[EntityType.BlockheadWalletAccount]: {
		detail: '$/views-new/BlockheadWalletAccountView.svelte',
		list: '$/views-new/BlockheadWalletAccountsView.svelte',
	},
	[EntityType.BlockheadWalletAuthentication]: {
		detail: '$/views-new/BlockheadWalletAuthenticationView.svelte',
		list: '$/views-new/BlockheadWalletAuthenticationsView.svelte',
	},
	[EntityType.BlockheadWalletCapabilityGrant]: {
		detail: '$/views-new/BlockheadWalletCapabilityGrantView.svelte',
		list: '$/views-new/BlockheadWalletCapabilityGrantsView.svelte',
	},
	[EntityType.BlockheadWalletConnection]: {
		detail: '$/views-new/BlockheadWalletConnectionView.svelte',
		list: '$/views-new/BlockheadWalletConnectionsView.svelte',
	},
	[EntityType.BlockheadWalletRequest]: {
		detail: '$/views-new/BlockheadWalletRequestView.svelte',
		list: '$/views-new/BlockheadWalletRequestsView.svelte',
	},
	[EntityType.BlockheadWalletRequest_Timestamp]: {
		detail: '$/views-new/BlockheadWalletRequest_TimestampView.svelte',
		list: '$/views-new/BlockheadWalletRequest_TimestampsView.svelte',
	},
	[EntityType.BlockheadWalletTransportSession]: {
		detail: '$/views-new/BlockheadWalletTransportSessionView.svelte',
		list: '$/views-new/BlockheadWalletTransportSessionsView.svelte',
	},
	[EntityType.BlockheadZcashNoteState]: {
		detail: '$/views-new/BlockheadZcashNoteStateView.svelte',
		list: '$/views-new/BlockheadZcashNoteStatesView.svelte',
	},
	[EntityType.BlockheadZcashNoteState_Timestamp]: {
		detail: '$/views-new/BlockheadZcashNoteState_TimestampView.svelte',
		list: '$/views-new/BlockheadZcashNoteState_TimestampsView.svelte',
	},
	[EntityType.BlockheadZcashViewingKey]: {
		detail: '$/views-new/BlockheadZcashViewingKeyView.svelte',
		list: '$/views-new/BlockheadZcashViewingKeysView.svelte',
	},
	[EntityType.BlockheadZcashViewingKey_Timestamp]: {
		detail: '$/views-new/BlockheadZcashViewingKey_TimestampView.svelte',
		list: '$/views-new/BlockheadZcashViewingKey_TimestampsView.svelte',
	},
	[EntityType.BlockheadZcashWalletState]: {
		detail: '$/views-new/BlockheadZcashWalletStateView.svelte',
	},
	[EntityType.BlockheadZcashWalletState_Timestamp]: {
		detail: '$/views-new/BlockheadZcashWalletState_TimestampView.svelte',
		list: '$/views-new/BlockheadZcashWalletState_TimestampsView.svelte',
	},
	[EntityType.BlockheadZeroGStorageNodeState]: {
		detail: '$/views-new/BlockheadZeroGStorageNodeStateView.svelte',
		list: '$/views-new/BlockheadZeroGStorageNodeStatesView.svelte',
	},
	[EntityType.BlockheadZeroGStorageNodeState_Timestamp]: {
		detail: '$/views-new/BlockheadZeroGStorageNodeState_TimestampView.svelte',
		list: '$/views-new/BlockheadZeroGStorageNodeState_TimestampsView.svelte',
	},
	[EntityType.BlockheadZeroGStorageProof]: {
		detail: '$/views-new/BlockheadZeroGStorageProofView.svelte',
		list: '$/views-new/BlockheadZeroGStorageProofsView.svelte',
	},
	[EntityType.BlockheadZeroGStoredChunk]: {
		detail: '$/views-new/BlockheadZeroGStoredChunkView.svelte',
		list: '$/views-new/BlockheadZeroGStoredChunksView.svelte',
	},
	[EntityType.BnbBeaconBlock]: {
		detail: '$/views-new/BnbBeaconBlockView.svelte',
		list: '$/views-new/BnbBeaconBlocksView.svelte',
	},
	[EntityType.BnbBeaconNetwork]: {
		detail: '$/views-new/BnbBeaconNetworkView.svelte',
	},
	[EntityType.BnbBeaconNetwork_Timestamp]: {
		detail: '$/views-new/BnbBeaconNetwork_TimestampView.svelte',
		list: '$/views-new/BnbBeaconNetwork_TimestampsView.svelte',
	},
	[EntityType.BnbBeaconToken]: {
		detail: '$/views-new/BnbBeaconTokenView.svelte',
		list: '$/views-new/BnbBeaconTokensView.svelte',
	},
	[EntityType.BnbBeaconTokenMigration]: {
		detail: '$/views-new/BnbBeaconTokenMigrationView.svelte',
		list: '$/views-new/BnbBeaconTokenMigrationsView.svelte',
	},
	[EntityType.BnbBeaconTokenMigration_Timestamp]: {
		detail: '$/views-new/BnbBeaconTokenMigration_TimestampView.svelte',
		list: '$/views-new/BnbBeaconTokenMigration_TimestampsView.svelte',
	},
	[EntityType.BnbBeaconTokenTransfer]: {
		detail: '$/views-new/BnbBeaconTokenTransferView.svelte',
		list: '$/views-new/BnbBeaconTokenTransfersView.svelte',
	},
	[EntityType.BnbBeaconToken_Timestamp]: {
		detail: '$/views-new/BnbBeaconToken_TimestampView.svelte',
		list: '$/views-new/BnbBeaconToken_TimestampsView.svelte',
	},
	[EntityType.BnbBeaconTransaction]: {
		detail: '$/views-new/BnbBeaconTransactionView.svelte',
		list: '$/views-new/BnbBeaconTransactionsView.svelte',
	},
	[EntityType.BnbValidator]: {
		detail: '$/views-new/BnbValidatorView.svelte',
		list: '$/views-new/BnbValidatorsView.svelte',
	},
	[EntityType.BnbValidator_Timestamp]: {
		detail: '$/views-new/BnbValidator_TimestampView.svelte',
		list: '$/views-new/BnbValidator_TimestampsView.svelte',
	},
	[EntityType.BridgeRoute]: {
		detail: '$/views-new/BridgeRouteView.svelte',
	},
	[EntityType.BridgeRouteQuoteStep]: {
		detail: '$/views-new/BridgeRouteQuoteStepView.svelte',
		list: '$/views-new/BridgeRouteQuoteStepsView.svelte',
	},
	[EntityType.BridgeRouteQuote_Timestamp]: {
		detail: '$/views-new/BridgeRouteQuote_TimestampView.svelte',
	},
	[EntityType.BridgeRouteStep]: {
		detail: '$/views-new/BridgeRouteStepView.svelte',
		list: '$/views-new/BridgeRouteStepsView.svelte',
	},
	[EntityType.BridgeTransfer]: {
		detail: '$/views-new/BridgeTransferView.svelte',
		list: '$/views-new/BridgeTransfersView.svelte',
	},
	[EntityType.BridgeTransfer_Timestamp]: {
		detail: '$/views-new/BridgeTransfer_TimestampView.svelte',
		list: '$/views-new/BridgeTransfer_TimestampsView.svelte',
	},
	[EntityType.CardanoAddress]: {
		detail: '$/views-new/CardanoAddressView.svelte',
		list: '$/views-new/CardanoAddresssView.svelte',
	},
	[EntityType.CardanoAddress_Timestamp]: {
		detail: '$/views-new/CardanoAddress_TimestampView.svelte',
		list: '$/views-new/CardanoAddress_TimestampsView.svelte',
	},
	[EntityType.CardanoBlock]: {
		detail: '$/views-new/CardanoBlockView.svelte',
		list: '$/views-new/CardanoBlocksView.svelte',
	},
	[EntityType.CardanoCertificate]: {
		detail: '$/views-new/CardanoCertificateView.svelte',
		list: '$/views-new/CardanoCertificatesView.svelte',
	},
	[EntityType.CardanoCommittee_Epoch]: {
		detail: '$/views-new/CardanoCommittee_EpochView.svelte',
		list: '$/views-new/CardanoCommittee_EpochsView.svelte',
	},
	[EntityType.CardanoConstitution_Epoch]: {
		detail: '$/views-new/CardanoConstitution_EpochView.svelte',
		list: '$/views-new/CardanoConstitution_EpochsView.svelte',
	},
	[EntityType.CardanoDRep]: {
		detail: '$/views-new/CardanoDRepView.svelte',
		list: '$/views-new/CardanoDRepsView.svelte',
	},
	[EntityType.CardanoDRep_Timestamp]: {
		detail: '$/views-new/CardanoDRep_TimestampView.svelte',
		list: '$/views-new/CardanoDRep_TimestampsView.svelte',
	},
	[EntityType.CardanoGovernanceProposal]: {
		detail: '$/views-new/CardanoGovernanceProposalView.svelte',
		list: '$/views-new/CardanoGovernanceProposalsView.svelte',
	},
	[EntityType.CardanoGovernanceProposal_Timestamp]: {
		detail: '$/views-new/CardanoGovernanceProposal_TimestampView.svelte',
		list: '$/views-new/CardanoGovernanceProposal_TimestampsView.svelte',
	},
	[EntityType.CardanoGovernanceVote]: {
		detail: '$/views-new/CardanoGovernanceVoteView.svelte',
		list: '$/views-new/CardanoGovernanceVotesView.svelte',
	},
	[EntityType.CardanoNativeAsset]: {
		detail: '$/views-new/CardanoNativeAssetView.svelte',
		list: '$/views-new/CardanoNativeAssetsView.svelte',
	},
	[EntityType.CardanoNativeAsset_Timestamp]: {
		detail: '$/views-new/CardanoNativeAsset_TimestampView.svelte',
		list: '$/views-new/CardanoNativeAsset_TimestampsView.svelte',
	},
	[EntityType.CardanoNetwork]: {
		detail: '$/views-new/CardanoNetworkView.svelte',
	},
	[EntityType.CardanoNetwork_Timestamp]: {
		detail: '$/views-new/CardanoNetwork_TimestampView.svelte',
		list: '$/views-new/CardanoNetwork_TimestampsView.svelte',
	},
	[EntityType.CardanoProtocolParameters_Epoch]: {
		detail: '$/views-new/CardanoProtocolParameters_EpochView.svelte',
		list: '$/views-new/CardanoProtocolParameters_EpochsView.svelte',
	},
	[EntityType.CardanoScriptWitness]: {
		detail: '$/views-new/CardanoScriptWitnessView.svelte',
		list: '$/views-new/CardanoScriptWitnesssView.svelte',
	},
	[EntityType.CardanoStakeCredential]: {
		detail: '$/views-new/CardanoStakeCredentialView.svelte',
		list: '$/views-new/CardanoStakeCredentialsView.svelte',
	},
	[EntityType.CardanoStakeDelegation_Epoch]: {
		detail: '$/views-new/CardanoStakeDelegation_EpochView.svelte',
		list: '$/views-new/CardanoStakeDelegation_EpochsView.svelte',
	},
	[EntityType.CardanoStakePool]: {
		detail: '$/views-new/CardanoStakePoolView.svelte',
		list: '$/views-new/CardanoStakePoolsView.svelte',
	},
	[EntityType.CardanoStakePool_Timestamp]: {
		detail: '$/views-new/CardanoStakePool_TimestampView.svelte',
		list: '$/views-new/CardanoStakePool_TimestampsView.svelte',
	},
	[EntityType.CardanoTransaction]: {
		detail: '$/views-new/CardanoTransactionView.svelte',
		list: '$/views-new/CardanoTransactionsView.svelte',
	},
	[EntityType.CardanoTxInput]: {
		detail: '$/views-new/CardanoTxInputView.svelte',
		list: '$/views-new/CardanoTxInputsView.svelte',
	},
	[EntityType.CardanoTxOutput]: {
		detail: '$/views-new/CardanoTxOutputView.svelte',
		list: '$/views-new/CardanoTxOutputsView.svelte',
	},
	[EntityType.CardanoTxOutputAsset]: {
		detail: '$/views-new/CardanoTxOutputAssetView.svelte',
		list: '$/views-new/CardanoTxOutputAssetsView.svelte',
	},
	[EntityType.CashuKeyset]: {
		detail: '$/views-new/CashuKeysetView.svelte',
		list: '$/views-new/CashuKeysetsView.svelte',
	},
	[EntityType.CashuKeyset_Timestamp]: {
		detail: '$/views-new/CashuKeyset_TimestampView.svelte',
	},
	[EntityType.CashuMint]: {
		detail: '$/views-new/CashuMintView.svelte',
	},
	[EntityType.CashuMint_Timestamp]: {
		detail: '$/views-new/CashuMint_TimestampView.svelte',
	},
	[EntityType.CctpAllowance]: {
		detail: '$/views-new/CctpAllowanceView.svelte',
	},
	[EntityType.CctpAttestation_Timestamp]: {
		detail: '$/views-new/CctpAttestation_TimestampView.svelte',
		list: '$/views-new/CctpAttestation_TimestampsView.svelte',
	},
	[EntityType.CctpBurnFee_Timestamp]: {
		detail: '$/views-new/CctpBurnFee_TimestampView.svelte',
		list: '$/views-new/CctpBurnFee_TimestampsView.svelte',
	},
	[EntityType.CctpDomainSupport]: {
		detail: '$/views-new/CctpDomainSupportView.svelte',
	},
	[EntityType.CctpFastBurnAllowance_Timestamp]: {
		detail: '$/views-new/CctpFastBurnAllowance_TimestampView.svelte',
	},
	[EntityType.CctpFee]: {
		detail: '$/views-new/CctpFeeView.svelte',
	},
	[EntityType.CctpMessage]: {
		detail: '$/views-new/CctpMessageView.svelte',
		list: '$/views-new/CctpMessagesView.svelte',
	},
	[EntityType.CelestiaBlob]: {
		detail: '$/views-new/CelestiaBlobView.svelte',
		list: '$/views-new/CelestiaBlobsView.svelte',
	},
	[EntityType.CelestiaBlock]: {
		detail: '$/views-new/CelestiaBlockView.svelte',
		list: '$/views-new/CelestiaBlocksView.svelte',
	},
	[EntityType.CelestiaNamespace]: {
		detail: '$/views-new/CelestiaNamespaceView.svelte',
		list: '$/views-new/CelestiaNamespacesView.svelte',
	},
	[EntityType.CelestiaNamespace_Timestamp]: {
		detail: '$/views-new/CelestiaNamespace_TimestampView.svelte',
		list: '$/views-new/CelestiaNamespace_TimestampsView.svelte',
	},
	[EntityType.CelestiaNetwork]: {
		detail: '$/views-new/CelestiaNetworkView.svelte',
	},
	[EntityType.CelestiaNetwork_Timestamp]: {
		detail: '$/views-new/CelestiaNetwork_TimestampView.svelte',
		list: '$/views-new/CelestiaNetwork_TimestampsView.svelte',
	},
	[EntityType.ClaimTopicRequirement]: {
		detail: '$/views-new/ClaimTopicRequirementView.svelte',
		list: '$/views-new/ClaimTopicRequirementsView.svelte',
	},
	[EntityType.CodexDataset]: {
		detail: '$/views-new/CodexDatasetView.svelte',
	},
	[EntityType.Coin]: {
		detail: '$/views-new/CoinView.svelte',
		list: '$/views-new/CoinsView.svelte',
	},
	[EntityType.CoinBridgeCapability]: {
		detail: '$/views-new/CoinBridgeCapabilityView.svelte',
		list: '$/views-new/CoinBridgeCapabilitysView.svelte',
	},
	[EntityType.Coin_Timestamp]: {
		detail: '$/views-new/Coin_TimestampView.svelte',
		list: '$/views-new/Coin_TimestampsView.svelte',
	},
	[EntityType.ComplianceModule]: {
		detail: '$/views-new/ComplianceModuleView.svelte',
		list: '$/views-new/ComplianceModulesView.svelte',
	},
	[EntityType.ContractInterfaceMember]: {
		detail: '$/views-new/ContractInterfaceMemberView.svelte',
	},
	[EntityType.CosmosAccount]: {
		detail: '$/views-new/CosmosAccountView.svelte',
		list: '$/views-new/CosmosAccountsView.svelte',
	},
	[EntityType.CosmosAccountBalance_Timestamp]: {
		detail: '$/views-new/CosmosAccountBalance_TimestampView.svelte',
		list: '$/views-new/CosmosAccountBalance_TimestampsView.svelte',
	},
	[EntityType.CosmosAccount_Timestamp]: {
		detail: '$/views-new/CosmosAccount_TimestampView.svelte',
		list: '$/views-new/CosmosAccount_TimestampsView.svelte',
	},
	[EntityType.CosmosBlock]: {
		detail: '$/views-new/CosmosBlockView.svelte',
		list: '$/views-new/CosmosBlocksView.svelte',
	},
	[EntityType.CosmosContract]: {
		detail: '$/views-new/CosmosContractView.svelte',
		list: '$/views-new/CosmosContractsView.svelte',
	},
	[EntityType.CosmosDelegation]: {
		detail: '$/views-new/CosmosDelegationView.svelte',
		list: '$/views-new/CosmosDelegationsView.svelte',
	},
	[EntityType.CosmosDelegation_Timestamp]: {
		detail: '$/views-new/CosmosDelegation_TimestampView.svelte',
		list: '$/views-new/CosmosDelegation_TimestampsView.svelte',
	},
	[EntityType.CosmosDenom]: {
		detail: '$/views-new/CosmosDenomView.svelte',
		list: '$/views-new/CosmosDenomsView.svelte',
	},
	[EntityType.CosmosGovernanceProposal]: {
		detail: '$/views-new/CosmosGovernanceProposalView.svelte',
		list: '$/views-new/CosmosGovernanceProposalsView.svelte',
	},
	[EntityType.CosmosGovernanceProposalDeposit]: {
		detail: '$/views-new/CosmosGovernanceProposalDepositView.svelte',
		list: '$/views-new/CosmosGovernanceProposalDepositsView.svelte',
	},
	[EntityType.CosmosGovernanceProposalDeposit_Timestamp]: {
		detail: '$/views-new/CosmosGovernanceProposalDeposit_TimestampView.svelte',
		list: '$/views-new/CosmosGovernanceProposalDeposit_TimestampsView.svelte',
	},
	[EntityType.CosmosGovernanceProposalTally_Timestamp]: {
		detail: '$/views-new/CosmosGovernanceProposalTally_TimestampView.svelte',
		list: '$/views-new/CosmosGovernanceProposalTally_TimestampsView.svelte',
	},
	[EntityType.CosmosGovernanceProposalVote]: {
		detail: '$/views-new/CosmosGovernanceProposalVoteView.svelte',
		list: '$/views-new/CosmosGovernanceProposalVotesView.svelte',
	},
	[EntityType.CosmosGovernanceProposalVote_Timestamp]: {
		detail: '$/views-new/CosmosGovernanceProposalVote_TimestampView.svelte',
		list: '$/views-new/CosmosGovernanceProposalVote_TimestampsView.svelte',
	},
	[EntityType.CosmosGovernanceProposal_Timestamp]: {
		detail: '$/views-new/CosmosGovernanceProposal_TimestampView.svelte',
		list: '$/views-new/CosmosGovernanceProposal_TimestampsView.svelte',
	},
	[EntityType.CosmosMessage]: {
		detail: '$/views-new/CosmosMessageView.svelte',
		list: '$/views-new/CosmosMessagesView.svelte',
	},
	[EntityType.CosmosModule]: {
		detail: '$/views-new/CosmosModuleView.svelte',
		list: '$/views-new/CosmosModulesView.svelte',
	},
	[EntityType.CosmosNetwork]: {
		detail: '$/views-new/CosmosNetworkView.svelte',
	},
	[EntityType.CosmosNetwork_Timestamp]: {
		detail: '$/views-new/CosmosNetwork_TimestampView.svelte',
		list: '$/views-new/CosmosNetwork_TimestampsView.svelte',
	},
	[EntityType.CosmosTransaction]: {
		detail: '$/views-new/CosmosTransactionView.svelte',
		list: '$/views-new/CosmosTransactionsView.svelte',
	},
	[EntityType.CosmosValidator]: {
		detail: '$/views-new/CosmosValidatorView.svelte',
		list: '$/views-new/CosmosValidatorsView.svelte',
	},
	[EntityType.CosmosValidator_Timestamp]: {
		detail: '$/views-new/CosmosValidator_TimestampView.svelte',
		list: '$/views-new/CosmosValidator_TimestampsView.svelte',
	},
	[EntityType.CronosNetworkProfile]: {
		detail: '$/views-new/CronosNetworkProfileView.svelte',
	},
	[EntityType.Currency]: {
		detail: '$/views-new/CurrencyView.svelte',
		list: '$/views-new/CurrencysView.svelte',
	},
	[EntityType.Currency_Timestamp]: {
		detail: '$/views-new/Currency_TimestampView.svelte',
		list: '$/views-new/Currency_TimestampsView.svelte',
	},
	[EntityType.DogecoinAuxPowMerkleBranch]: {
		detail: '$/views-new/DogecoinAuxPowMerkleBranchView.svelte',
	},
	[EntityType.DogecoinAuxPowParentBlockHeader]: {
		detail: '$/views-new/DogecoinAuxPowParentBlockHeaderView.svelte',
	},
	[EntityType.DogecoinBlockAuxPow]: {
		detail: '$/views-new/DogecoinBlockAuxPowView.svelte',
	},
	[EntityType.DydxChainMarket]: {
		detail: '$/views-new/DydxChainMarketView.svelte',
		list: '$/views-new/DydxChainMarketsView.svelte',
	},
	[EntityType.DydxChainMarket_Timestamp]: {
		detail: '$/views-new/DydxChainMarket_TimestampView.svelte',
		list: '$/views-new/DydxChainMarket_TimestampsView.svelte',
	},
	[EntityType.DydxChainNetwork]: {
		detail: '$/views-new/DydxChainNetworkView.svelte',
	},
	[EntityType.DydxChainNetwork_Timestamp]: {
		detail: '$/views-new/DydxChainNetwork_TimestampView.svelte',
		list: '$/views-new/DydxChainNetwork_TimestampsView.svelte',
	},
	[EntityType.DydxChainOrder]: {
		detail: '$/views-new/DydxChainOrderView.svelte',
		list: '$/views-new/DydxChainOrdersView.svelte',
	},
	[EntityType.DydxChainOrder_Timestamp]: {
		detail: '$/views-new/DydxChainOrder_TimestampView.svelte',
		list: '$/views-new/DydxChainOrder_TimestampsView.svelte',
	},
	[EntityType.DydxChainPerpetualPosition_Timestamp]: {
		detail: '$/views-new/DydxChainPerpetualPosition_TimestampView.svelte',
		list: '$/views-new/DydxChainPerpetualPosition_TimestampsView.svelte',
	},
	[EntityType.DydxChainSubaccount]: {
		detail: '$/views-new/DydxChainSubaccountView.svelte',
		list: '$/views-new/DydxChainSubaccountsView.svelte',
	},
	[EntityType.DydxChainSubaccount_Timestamp]: {
		detail: '$/views-new/DydxChainSubaccount_TimestampView.svelte',
		list: '$/views-new/DydxChainSubaccount_TimestampsView.svelte',
	},
	[EntityType.EasAttestation]: {
		detail: '$/views-new/EasAttestationView.svelte',
		list: '$/views-new/EasAttestationsView.svelte',
	},
	[EntityType.EasAttestation_Timestamp]: {
		detail: '$/views-new/EasAttestation_TimestampView.svelte',
		list: '$/views-new/EasAttestation_TimestampsView.svelte',
	},
	[EntityType.EasSchema]: {
		detail: '$/views-new/EasSchemaView.svelte',
	},
	[EntityType.EigenLayerAllocation_Timestamp]: {
		detail: '$/views-new/EigenLayerAllocation_TimestampView.svelte',
		list: '$/views-new/EigenLayerAllocation_TimestampsView.svelte',
	},
	[EntityType.EigenLayerAvs]: {
		detail: '$/views-new/EigenLayerAvsView.svelte',
		list: '$/views-new/EigenLayerAvssView.svelte',
	},
	[EntityType.EigenLayerAvs_Timestamp]: {
		detail: '$/views-new/EigenLayerAvs_TimestampView.svelte',
		list: '$/views-new/EigenLayerAvs_TimestampsView.svelte',
	},
	[EntityType.EigenLayerDelegation_Timestamp]: {
		detail: '$/views-new/EigenLayerDelegation_TimestampView.svelte',
		list: '$/views-new/EigenLayerDelegation_TimestampsView.svelte',
	},
	[EntityType.EigenLayerOperator]: {
		detail: '$/views-new/EigenLayerOperatorView.svelte',
		list: '$/views-new/EigenLayerOperatorsView.svelte',
	},
	[EntityType.EigenLayerProtocol]: {
		detail: '$/views-new/EigenLayerProtocolView.svelte',
	},
	[EntityType.EigenLayerReward_Timestamp]: {
		detail: '$/views-new/EigenLayerReward_TimestampView.svelte',
		list: '$/views-new/EigenLayerReward_TimestampsView.svelte',
	},
	[EntityType.EigenLayerSlashingEvent]: {
		detail: '$/views-new/EigenLayerSlashingEventView.svelte',
		list: '$/views-new/EigenLayerSlashingEventsView.svelte',
	},
	[EntityType.EigenLayerStrategy]: {
		detail: '$/views-new/EigenLayerStrategyView.svelte',
		list: '$/views-new/EigenLayerStrategysView.svelte',
	},
	[EntityType.EigenLayerStrategy_Timestamp]: {
		detail: '$/views-new/EigenLayerStrategy_TimestampView.svelte',
		list: '$/views-new/EigenLayerStrategy_TimestampsView.svelte',
	},
	[EntityType.Eip7702Authorization]: {
		detail: '$/views-new/Eip7702AuthorizationView.svelte',
	},
	[EntityType.Eip8004AgentRegistration]: {
		detail: '$/views-new/Eip8004AgentRegistrationView.svelte',
		list: '$/views-new/Eip8004AgentRegistrationsView.svelte',
	},
	[EntityType.Eip8004AgentRegistrationFile]: {
		detail: '$/views-new/Eip8004AgentRegistrationFileView.svelte',
		list: '$/views-new/Eip8004AgentRegistrationFilesView.svelte',
	},
	[EntityType.Eip8004AgentRegistration_Timestamp]: {
		detail: '$/views-new/Eip8004AgentRegistration_TimestampView.svelte',
		list: '$/views-new/Eip8004AgentRegistration_TimestampsView.svelte',
	},
	[EntityType.Eip8004AgentServiceEndpoint]: {
		detail: '$/views-new/Eip8004AgentServiceEndpointView.svelte',
		list: '$/views-new/Eip8004AgentServiceEndpointsView.svelte',
	},
	[EntityType.Eip8004CrossRegistration]: {
		detail: '$/views-new/Eip8004CrossRegistrationView.svelte',
		list: '$/views-new/Eip8004CrossRegistrationsView.svelte',
	},
	[EntityType.Eip8004EndpointDomainVerification_Timestamp]: {
		detail: '$/views-new/Eip8004EndpointDomainVerification_TimestampView.svelte',
	},
	[EntityType.Eip8004ReputationFeedback_Timestamp]: {
		detail: '$/views-new/Eip8004ReputationFeedback_TimestampView.svelte',
	},
	[EntityType.Eip8004Validation_Timestamp]: {
		detail: '$/views-new/Eip8004Validation_TimestampView.svelte',
	},
	[EntityType.ElementsAsset]: {
		detail: '$/views-new/ElementsAssetView.svelte',
		list: '$/views-new/ElementsAssetsView.svelte',
	},
	[EntityType.ElementsAsset_Timestamp]: {
		detail: '$/views-new/ElementsAsset_TimestampView.svelte',
		list: '$/views-new/ElementsAsset_TimestampsView.svelte',
	},
	[EntityType.ElementsIssuance]: {
		detail: '$/views-new/ElementsIssuanceView.svelte',
		list: '$/views-new/ElementsIssuancesView.svelte',
	},
	[EntityType.ElementsNetwork]: {
		detail: '$/views-new/ElementsNetworkView.svelte',
	},
	[EntityType.ElementsPeg]: {
		detail: '$/views-new/ElementsPegView.svelte',
	},
	[EntityType.ElementsPeg_Timestamp]: {
		detail: '$/views-new/ElementsPeg_TimestampView.svelte',
		list: '$/views-new/ElementsPeg_TimestampsView.svelte',
	},
	[EntityType.EnsName]: {
		detail: '$/views-new/EnsNameView.svelte',
		list: '$/views-new/EnsNamesView.svelte',
	},
	[EntityType.EnsName_Timestamp]: {
		detail: '$/views-new/EnsName_TimestampView.svelte',
		list: '$/views-new/EnsName_TimestampsView.svelte',
	},
	[EntityType.EnsRecord]: {
		detail: '$/views-new/EnsRecordView.svelte',
		list: '$/views-new/EnsRecordsView.svelte',
	},
	[EntityType.EnsRecord_Timestamp]: {
		detail: '$/views-new/EnsRecord_TimestampView.svelte',
		list: '$/views-new/EnsRecord_TimestampsView.svelte',
	},
	[EntityType.EnsReverseRecord]: {
		detail: '$/views-new/EnsReverseRecordView.svelte',
		list: '$/views-new/EnsReverseRecordsView.svelte',
	},
	[EntityType.EnsReverseRecord_Timestamp]: {
		detail: '$/views-new/EnsReverseRecord_TimestampView.svelte',
		list: '$/views-new/EnsReverseRecord_TimestampsView.svelte',
	},
	[EntityType.Erc4337AccountFactory]: {
		detail: '$/views-new/Erc4337AccountFactoryView.svelte',
		list: '$/views-new/Erc4337AccountFactorysView.svelte',
	},
	[EntityType.Erc4337AccountFactory_Timestamp]: {
		detail: '$/views-new/Erc4337AccountFactory_TimestampView.svelte',
		list: '$/views-new/Erc4337AccountFactory_TimestampsView.svelte',
	},
	[EntityType.Erc4337Bundler]: {
		detail: '$/views-new/Erc4337BundlerView.svelte',
		list: '$/views-new/Erc4337BundlersView.svelte',
	},
	[EntityType.Erc4337Bundler_Timestamp]: {
		detail: '$/views-new/Erc4337Bundler_TimestampView.svelte',
		list: '$/views-new/Erc4337Bundler_TimestampsView.svelte',
	},
	[EntityType.Erc4337Paymaster]: {
		detail: '$/views-new/Erc4337PaymasterView.svelte',
		list: '$/views-new/Erc4337PaymastersView.svelte',
	},
	[EntityType.Erc4337Paymaster_Timestamp]: {
		detail: '$/views-new/Erc4337Paymaster_TimestampView.svelte',
		list: '$/views-new/Erc4337Paymaster_TimestampsView.svelte',
	},
	[EntityType.Erc4337SmartAccount]: {
		detail: '$/views-new/Erc4337SmartAccountView.svelte',
		list: '$/views-new/Erc4337SmartAccountsView.svelte',
	},
	[EntityType.Erc4337SmartAccount_Timestamp]: {
		detail: '$/views-new/Erc4337SmartAccount_TimestampView.svelte',
		list: '$/views-new/Erc4337SmartAccount_TimestampsView.svelte',
	},
	[EntityType.Erc4626Vault]: {
		detail: '$/views-new/Erc4626VaultView.svelte',
	},
	[EntityType.Erc4626Vault_Block]: {
		detail: '$/views-new/Erc4626Vault_BlockView.svelte',
		list: '$/views-new/Erc4626Vault_BlocksView.svelte',
	},
	[EntityType.Erc4626Vault_Timestamp]: {
		detail: '$/views-new/Erc4626Vault_TimestampView.svelte',
		list: '$/views-new/Erc4626Vault_TimestampsView.svelte',
	},
	[EntityType.EthereumBeaconFinality_Timestamp]: {
		detail: '$/views-new/EthereumBeaconFinality_TimestampView.svelte',
		list: '$/views-new/EthereumBeaconFinality_TimestampsView.svelte',
	},
	[EntityType.EthereumConsensusUpgrade]: {
		detail: '$/views-new/EthereumConsensusUpgradeView.svelte',
		list: '$/views-new/EthereumConsensusUpgradesView.svelte',
	},
	[EntityType.EthereumExecutionUpgrade]: {
		detail: '$/views-new/EthereumExecutionUpgradeView.svelte',
		list: '$/views-new/EthereumExecutionUpgradesView.svelte',
	},
	[EntityType.EthereumNetworkUpgrade]: {
		detail: '$/views-new/EthereumNetworkUpgradeView.svelte',
		list: '$/views-new/EthereumNetworkUpgradesView.svelte',
	},
	[EntityType.EvmAccount]: {
		detail: '$/views-new/EvmAccountView.svelte',
		list: '$/views-new/EvmAccountsView.svelte',
	},
	[EntityType.EvmActorCoinAllowance]: {
		detail: '$/views-new/EvmActorCoinAllowanceView.svelte',
		list: '$/views-new/EvmActorCoinAllowancesView.svelte',
	},
	[EntityType.EvmActorCoinAllowance_Block]: {
		detail: '$/views-new/EvmActorCoinAllowance_BlockView.svelte',
		list: '$/views-new/EvmActorCoinAllowance_BlocksView.svelte',
	},
	[EntityType.EvmBlob]: {
		detail: '$/views-new/EvmBlobView.svelte',
		list: '$/views-new/EvmBlobsView.svelte',
	},
	[EntityType.EvmBlock]: {
		detail: '$/views-new/EvmBlockView.svelte',
		list: '$/views-new/EvmBlocksView.svelte',
	},
	[EntityType.EvmCalldata]: {
		detail: '$/views-new/EvmCalldataView.svelte',
	},
	[EntityType.EvmCoinInstance]: {
		detail: '$/views-new/EvmCoinInstanceView.svelte',
		list: '$/views-new/EvmCoinInstancesView.svelte',
	},
	[EntityType.EvmContract]: {
		detail: '$/views-new/EvmContractView.svelte',
		list: '$/views-new/EvmContractsView.svelte',
	},
	[EntityType.EvmContractCompilation]: {
		detail: '$/views-new/EvmContractCompilationView.svelte',
	},
	[EntityType.EvmContractSourceBundle]: {
		detail: '$/views-new/EvmContractSourceBundleView.svelte',
	},
	[EntityType.EvmContractVerification]: {
		detail: '$/views-new/EvmContractVerificationView.svelte',
	},
	[EntityType.EvmError]: {
		detail: '$/views-new/EvmErrorView.svelte',
		list: '$/views-new/EvmErrorsView.svelte',
	},
	[EntityType.EvmError_Timestamp]: {
		detail: '$/views-new/EvmError_TimestampView.svelte',
		list: '$/views-new/EvmError_TimestampsView.svelte',
	},
	[EntityType.EvmInternalTransfer]: {
		detail: '$/views-new/EvmInternalTransferView.svelte',
		list: '$/views-new/EvmInternalTransfersView.svelte',
	},
	[EntityType.EvmLog]: {
		detail: '$/views-new/EvmLogView.svelte',
		list: '$/views-new/EvmLogsView.svelte',
	},
	[EntityType.EvmNetwork]: {
		detail: '$/views-new/EvmNetworkView.svelte',
		list: '$/views-new/EvmNetworksView.svelte',
	},
	[EntityType.EvmNetworkAccount]: {
		detail: '$/views-new/EvmNetworkAccountView.svelte',
	},
	[EntityType.EvmNetworkAccount_Timestamp]: {
		detail: '$/views-new/EvmNetworkAccount_TimestampView.svelte',
		list: '$/views-new/EvmNetworkAccount_TimestampsView.svelte',
	},
	[EntityType.EvmNetworkActorCoinBalance]: {
		detail: '$/views-new/EvmNetworkActorCoinBalanceView.svelte',
		list: '$/views-new/EvmNetworkActorCoinBalancesView.svelte',
	},
	[EntityType.EvmNetworkActorCoinBalance_EvmBlock]: {
		detail: '$/views-new/EvmNetworkActorCoinBalance_EvmBlockView.svelte',
		list: '$/views-new/EvmNetworkActorCoinBalance_EvmBlocksView.svelte',
	},
	[EntityType.EvmNetworkActorCoinBalance_Timestamp]: {
		detail: '$/views-new/EvmNetworkActorCoinBalance_TimestampView.svelte',
		list: '$/views-new/EvmNetworkActorCoinBalance_TimestampsView.svelte',
	},
	[EntityType.EvmNetworkBridge]: {
		detail: '$/views-new/EvmNetworkBridgeView.svelte',
		list: '$/views-new/EvmNetworkBridgesView.svelte',
	},
	[EntityType.EvmNetwork_GasEstimate_Timestamp]: {
		detail: '$/views-new/EvmNetwork_GasEstimate_TimestampView.svelte',
		list: '$/views-new/EvmNetwork_GasEstimate_TimestampsView.svelte',
	},
	[EntityType.EvmNetwork_GasFee_Block]: {
		detail: '$/views-new/EvmNetwork_GasFee_BlockView.svelte',
		list: '$/views-new/EvmNetwork_GasFee_BlocksView.svelte',
	},
	[EntityType.EvmNetwork_Timestamp]: {
		detail: '$/views-new/EvmNetwork_TimestampView.svelte',
		list: '$/views-new/EvmNetwork_TimestampsView.svelte',
	},
	[EntityType.EvmNetwork_Txpool_Timestamp]: {
		detail: '$/views-new/EvmNetwork_Txpool_TimestampView.svelte',
		list: '$/views-new/EvmNetwork_Txpool_TimestampsView.svelte',
	},
	[EntityType.EvmNft]: {
		detail: '$/views-new/EvmNftView.svelte',
		list: '$/views-new/EvmNftsView.svelte',
	},
	[EntityType.EvmProtocol]: {
		detail: '$/views-new/EvmProtocolView.svelte',
	},
	[EntityType.EvmRollup]: {
		detail: '$/views-new/EvmRollupView.svelte',
		list: '$/views-new/EvmRollupsView.svelte',
	},
	[EntityType.EvmRollup_Timestamp]: {
		detail: '$/views-new/EvmRollup_TimestampView.svelte',
		list: '$/views-new/EvmRollup_TimestampsView.svelte',
	},
	[EntityType.EvmSelector]: {
		detail: '$/views-new/EvmSelectorView.svelte',
		list: '$/views-new/EvmSelectorsView.svelte',
	},
	[EntityType.EvmSelector_Timestamp]: {
		detail: '$/views-new/EvmSelector_TimestampView.svelte',
		list: '$/views-new/EvmSelector_TimestampsView.svelte',
	},
	[EntityType.EvmStorageRead_Timestamp]: {
		detail: '$/views-new/EvmStorageRead_TimestampView.svelte',
	},
	[EntityType.EvmTokenTransfer]: {
		detail: '$/views-new/EvmTokenTransferView.svelte',
		list: '$/views-new/EvmTokenTransfersView.svelte',
	},
	[EntityType.EvmTopic]: {
		detail: '$/views-new/EvmTopicView.svelte',
		list: '$/views-new/EvmTopicsView.svelte',
	},
	[EntityType.EvmTopic_Timestamp]: {
		detail: '$/views-new/EvmTopic_TimestampView.svelte',
		list: '$/views-new/EvmTopic_TimestampsView.svelte',
	},
	[EntityType.EvmTrace]: {
		detail: '$/views-new/EvmTraceView.svelte',
		list: '$/views-new/EvmTracesView.svelte',
	},
	[EntityType.EvmTransaction]: {
		detail: '$/views-new/EvmTransactionView.svelte',
		list: '$/views-new/EvmTransactionsView.svelte',
	},
	[EntityType.EvmUserOperation]: {
		detail: '$/views-new/EvmUserOperationView.svelte',
		list: '$/views-new/EvmUserOperationsView.svelte',
	},
	[EntityType.FarcasterCast]: {
		detail: '$/views-new/FarcasterCastView.svelte',
		list: '$/views-new/FarcasterCastsView.svelte',
	},
	[EntityType.FarcasterCastEmbed]: {
		detail: '$/views-new/FarcasterCastEmbedView.svelte',
		list: '$/views-new/FarcasterCastEmbedsView.svelte',
	},
	[EntityType.FarcasterCast_Timestamp]: {
		detail: '$/views-new/FarcasterCast_TimestampView.svelte',
		list: '$/views-new/FarcasterCast_TimestampsView.svelte',
	},
	[EntityType.FarcasterChannel]: {
		detail: '$/views-new/FarcasterChannelView.svelte',
		list: '$/views-new/FarcasterChannelsView.svelte',
	},
	[EntityType.FarcasterChannel_Timestamp]: {
		detail: '$/views-new/FarcasterChannel_TimestampView.svelte',
		list: '$/views-new/FarcasterChannel_TimestampsView.svelte',
	},
	[EntityType.FarcasterFeed]: {
		detail: '$/views-new/FarcasterFeedView.svelte',
		list: '$/views-new/FarcasterFeedsView.svelte',
	},
	[EntityType.FarcasterNetwork]: {
		detail: '$/views-new/FarcasterNetworkView.svelte',
	},
	[EntityType.FarcasterUser]: {
		detail: '$/views-new/FarcasterUserView.svelte',
		list: '$/views-new/FarcasterUsersView.svelte',
	},
	[EntityType.FarcasterUser_Timestamp]: {
		detail: '$/views-new/FarcasterUser_TimestampView.svelte',
		list: '$/views-new/FarcasterUser_TimestampsView.svelte',
	},
	[EntityType.FarcasterVerifiedAddress]: {
		detail: '$/views-new/FarcasterVerifiedAddressView.svelte',
		list: '$/views-new/FarcasterVerifiedAddresssView.svelte',
	},
	[EntityType.FedimintFederation]: {
		detail: '$/views-new/FedimintFederationView.svelte',
		list: '$/views-new/FedimintFederationsView.svelte',
	},
	[EntityType.FedimintFederation_Timestamp]: {
		detail: '$/views-new/FedimintFederation_TimestampView.svelte',
		list: '$/views-new/FedimintFederation_TimestampsView.svelte',
	},
	[EntityType.FedimintGateway]: {
		detail: '$/views-new/FedimintGatewayView.svelte',
		list: '$/views-new/FedimintGatewaysView.svelte',
	},
	[EntityType.FedimintGateway_Timestamp]: {
		detail: '$/views-new/FedimintGateway_TimestampView.svelte',
		list: '$/views-new/FedimintGateway_TimestampsView.svelte',
	},
	[EntityType.FilecoinActor]: {
		detail: '$/views-new/FilecoinActorView.svelte',
	},
	[EntityType.FilecoinActor_Timestamp]: {
		detail: '$/views-new/FilecoinActor_TimestampView.svelte',
	},
	[EntityType.FilecoinBlock]: {
		detail: '$/views-new/FilecoinBlockView.svelte',
		list: '$/views-new/FilecoinBlocksView.svelte',
	},
	[EntityType.FilecoinDeal]: {
		detail: '$/views-new/FilecoinDealView.svelte',
	},
	[EntityType.FilecoinDeal_Timestamp]: {
		detail: '$/views-new/FilecoinDeal_TimestampView.svelte',
		list: '$/views-new/FilecoinDeal_TimestampsView.svelte',
	},
	[EntityType.FilecoinMessage]: {
		detail: '$/views-new/FilecoinMessageView.svelte',
		list: '$/views-new/FilecoinMessagesView.svelte',
	},
	[EntityType.FilecoinMessageReceipt]: {
		detail: '$/views-new/FilecoinMessageReceiptView.svelte',
	},
	[EntityType.FilecoinMiner]: {
		detail: '$/views-new/FilecoinMinerView.svelte',
		list: '$/views-new/FilecoinMinersView.svelte',
	},
	[EntityType.FilecoinMiner_Timestamp]: {
		detail: '$/views-new/FilecoinMiner_TimestampView.svelte',
	},
	[EntityType.FilecoinNetwork]: {
		detail: '$/views-new/FilecoinNetworkView.svelte',
	},
	[EntityType.FilecoinNetwork_Timestamp]: {
		detail: '$/views-new/FilecoinNetwork_TimestampView.svelte',
		list: '$/views-new/FilecoinNetwork_TimestampsView.svelte',
	},
	[EntityType.FilecoinSector]: {
		detail: '$/views-new/FilecoinSectorView.svelte',
		list: '$/views-new/FilecoinSectorsView.svelte',
	},
	[EntityType.FilecoinSector_Timestamp]: {
		detail: '$/views-new/FilecoinSector_TimestampView.svelte',
	},
	[EntityType.FilecoinTipset]: {
		detail: '$/views-new/FilecoinTipsetView.svelte',
		list: '$/views-new/FilecoinTipsetsView.svelte',
	},
	[EntityType.GitBlob]: {
		detail: '$/views-new/GitBlobView.svelte',
	},
	[EntityType.GitCommit]: {
		detail: '$/views-new/GitCommitView.svelte',
	},
	[EntityType.GitFetchObservation]: {
		detail: '$/views-new/GitFetchObservationView.svelte',
		list: '$/views-new/GitFetchObservationsView.svelte',
	},
	[EntityType.GitForgeIssue]: {
		detail: '$/views-new/GitForgeIssueView.svelte',
	},
	[EntityType.GitForgeMirror]: {
		detail: '$/views-new/GitForgeMirrorView.svelte',
	},
	[EntityType.GitForgePullRequest]: {
		detail: '$/views-new/GitForgePullRequestView.svelte',
	},
	[EntityType.GitForgeRelease]: {
		detail: '$/views-new/GitForgeReleaseView.svelte',
	},
	[EntityType.GitLooseObject]: {
		detail: '$/views-new/GitLooseObjectView.svelte',
	},
	[EntityType.GitObject]: {
		detail: '$/views-new/GitObjectView.svelte',
		list: '$/views-new/GitObjectsView.svelte',
	},
	[EntityType.GitObjectVerification_Timestamp]: {
		detail: '$/views-new/GitObjectVerification_TimestampView.svelte',
	},
	[EntityType.GitPackedObject]: {
		detail: '$/views-new/GitPackedObjectView.svelte',
	},
	[EntityType.GitPackfile]: {
		detail: '$/views-new/GitPackfileView.svelte',
	},
	[EntityType.GitRef]: {
		detail: '$/views-new/GitRefView.svelte',
		list: '$/views-new/GitRefsView.svelte',
	},
	[EntityType.GitRefObservation_Timestamp]: {
		detail: '$/views-new/GitRefObservation_TimestampView.svelte',
		list: '$/views-new/GitRefObservation_TimestampsView.svelte',
	},
	[EntityType.GitRefUpdate]: {
		detail: '$/views-new/GitRefUpdateView.svelte',
	},
	[EntityType.GitRemote]: {
		detail: '$/views-new/GitRemoteView.svelte',
		list: '$/views-new/GitRemotesView.svelte',
	},
	[EntityType.GitRepository]: {
		detail: '$/views-new/GitRepositoryView.svelte',
	},
	[EntityType.GitSignature]: {
		detail: '$/views-new/GitSignatureView.svelte',
		list: '$/views-new/GitSignaturesView.svelte',
	},
	[EntityType.GitTag]: {
		detail: '$/views-new/GitTagView.svelte',
	},
	[EntityType.GitTree]: {
		detail: '$/views-new/GitTreeView.svelte',
	},
	[EntityType.GitTreeEntry]: {
		detail: '$/views-new/GitTreeEntryView.svelte',
		list: '$/views-new/GitTreeEntrysView.svelte',
	},
	[EntityType.GitTreePathResolution]: {
		detail: '$/views-new/GitTreePathResolutionView.svelte',
	},
	[EntityType.HederaAccount]: {
		detail: '$/views-new/HederaAccountView.svelte',
		list: '$/views-new/HederaAccountsView.svelte',
	},
	[EntityType.HederaAccount_Timestamp]: {
		detail: '$/views-new/HederaAccount_TimestampView.svelte',
		list: '$/views-new/HederaAccount_TimestampsView.svelte',
	},
	[EntityType.HederaAllowance]: {
		detail: '$/views-new/HederaAllowanceView.svelte',
		list: '$/views-new/HederaAllowancesView.svelte',
	},
	[EntityType.HederaAllowance_Timestamp]: {
		detail: '$/views-new/HederaAllowance_TimestampView.svelte',
		list: '$/views-new/HederaAllowance_TimestampsView.svelte',
	},
	[EntityType.HederaBlock]: {
		detail: '$/views-new/HederaBlockView.svelte',
		list: '$/views-new/HederaBlocksView.svelte',
	},
	[EntityType.HederaContract]: {
		detail: '$/views-new/HederaContractView.svelte',
		list: '$/views-new/HederaContractsView.svelte',
	},
	[EntityType.HederaContractAction]: {
		detail: '$/views-new/HederaContractActionView.svelte',
		list: '$/views-new/HederaContractActionsView.svelte',
	},
	[EntityType.HederaContractLog]: {
		detail: '$/views-new/HederaContractLogView.svelte',
		list: '$/views-new/HederaContractLogsView.svelte',
	},
	[EntityType.HederaContractResult]: {
		detail: '$/views-new/HederaContractResultView.svelte',
		list: '$/views-new/HederaContractResultsView.svelte',
	},
	[EntityType.HederaContractState_Timestamp]: {
		detail: '$/views-new/HederaContractState_TimestampView.svelte',
		list: '$/views-new/HederaContractState_TimestampsView.svelte',
	},
	[EntityType.HederaContract_Timestamp]: {
		detail: '$/views-new/HederaContract_TimestampView.svelte',
		list: '$/views-new/HederaContract_TimestampsView.svelte',
	},
	[EntityType.HederaHbarTransfer]: {
		detail: '$/views-new/HederaHbarTransferView.svelte',
		list: '$/views-new/HederaHbarTransfersView.svelte',
	},
	[EntityType.HederaNetwork]: {
		detail: '$/views-new/HederaNetworkView.svelte',
	},
	[EntityType.HederaNetworkExchangeRate_Timestamp]: {
		detail: '$/views-new/HederaNetworkExchangeRate_TimestampView.svelte',
		list: '$/views-new/HederaNetworkExchangeRate_TimestampsView.svelte',
	},
	[EntityType.HederaNetworkFee_Timestamp]: {
		detail: '$/views-new/HederaNetworkFee_TimestampView.svelte',
		list: '$/views-new/HederaNetworkFee_TimestampsView.svelte',
	},
	[EntityType.HederaNetworkStake_Timestamp]: {
		detail: '$/views-new/HederaNetworkStake_TimestampView.svelte',
		list: '$/views-new/HederaNetworkStake_TimestampsView.svelte',
	},
	[EntityType.HederaNetworkSupply_Timestamp]: {
		detail: '$/views-new/HederaNetworkSupply_TimestampView.svelte',
		list: '$/views-new/HederaNetworkSupply_TimestampsView.svelte',
	},
	[EntityType.HederaNetwork_Timestamp]: {
		detail: '$/views-new/HederaNetwork_TimestampView.svelte',
		list: '$/views-new/HederaNetwork_TimestampsView.svelte',
	},
	[EntityType.HederaNft]: {
		detail: '$/views-new/HederaNftView.svelte',
		list: '$/views-new/HederaNftsView.svelte',
	},
	[EntityType.HederaNft_Timestamp]: {
		detail: '$/views-new/HederaNft_TimestampView.svelte',
		list: '$/views-new/HederaNft_TimestampsView.svelte',
	},
	[EntityType.HederaNode]: {
		detail: '$/views-new/HederaNodeView.svelte',
		list: '$/views-new/HederaNodesView.svelte',
	},
	[EntityType.HederaNode_Timestamp]: {
		detail: '$/views-new/HederaNode_TimestampView.svelte',
		list: '$/views-new/HederaNode_TimestampsView.svelte',
	},
	[EntityType.HederaSchedule]: {
		detail: '$/views-new/HederaScheduleView.svelte',
		list: '$/views-new/HederaSchedulesView.svelte',
	},
	[EntityType.HederaScheduleSignature]: {
		detail: '$/views-new/HederaScheduleSignatureView.svelte',
		list: '$/views-new/HederaScheduleSignaturesView.svelte',
	},
	[EntityType.HederaSchedule_Timestamp]: {
		detail: '$/views-new/HederaSchedule_TimestampView.svelte',
		list: '$/views-new/HederaSchedule_TimestampsView.svelte',
	},
	[EntityType.HederaToken]: {
		detail: '$/views-new/HederaTokenView.svelte',
		list: '$/views-new/HederaTokensView.svelte',
	},
	[EntityType.HederaTokenAssociation]: {
		detail: '$/views-new/HederaTokenAssociationView.svelte',
		list: '$/views-new/HederaTokenAssociationsView.svelte',
	},
	[EntityType.HederaTokenAssociation_Timestamp]: {
		detail: '$/views-new/HederaTokenAssociation_TimestampView.svelte',
		list: '$/views-new/HederaTokenAssociation_TimestampsView.svelte',
	},
	[EntityType.HederaTokenCustomFee]: {
		detail: '$/views-new/HederaTokenCustomFeeView.svelte',
		list: '$/views-new/HederaTokenCustomFeesView.svelte',
	},
	[EntityType.HederaTokenTransfer]: {
		detail: '$/views-new/HederaTokenTransferView.svelte',
		list: '$/views-new/HederaTokenTransfersView.svelte',
	},
	[EntityType.HederaToken_Timestamp]: {
		detail: '$/views-new/HederaToken_TimestampView.svelte',
		list: '$/views-new/HederaToken_TimestampsView.svelte',
	},
	[EntityType.HederaTopic]: {
		detail: '$/views-new/HederaTopicView.svelte',
		list: '$/views-new/HederaTopicsView.svelte',
	},
	[EntityType.HederaTopicMessage]: {
		detail: '$/views-new/HederaTopicMessageView.svelte',
		list: '$/views-new/HederaTopicMessagesView.svelte',
	},
	[EntityType.HederaTopic_Timestamp]: {
		detail: '$/views-new/HederaTopic_TimestampView.svelte',
		list: '$/views-new/HederaTopic_TimestampsView.svelte',
	},
	[EntityType.HederaTransaction]: {
		detail: '$/views-new/HederaTransactionView.svelte',
		list: '$/views-new/HederaTransactionsView.svelte',
	},
	[EntityType.HyperliquidAccount]: {
		detail: '$/views-new/HyperliquidAccountView.svelte',
	},
	[EntityType.HyperliquidAccount_Timestamp]: {
		detail: '$/views-new/HyperliquidAccount_TimestampView.svelte',
		list: '$/views-new/HyperliquidAccount_TimestampsView.svelte',
	},
	[EntityType.HyperliquidBlock]: {
		detail: '$/views-new/HyperliquidBlockView.svelte',
		list: '$/views-new/HyperliquidBlocksView.svelte',
	},
	[EntityType.HyperliquidFill]: {
		detail: '$/views-new/HyperliquidFillView.svelte',
		list: '$/views-new/HyperliquidFillsView.svelte',
	},
	[EntityType.HyperliquidMarket_TimeInterval_Timestamp]: {
		detail: '$/views-new/HyperliquidMarket_TimeInterval_TimestampView.svelte',
	},
	[EntityType.HyperliquidNetwork]: {
		detail: '$/views-new/HyperliquidNetworkView.svelte',
	},
	[EntityType.HyperliquidNetwork_Timestamp]: {
		detail: '$/views-new/HyperliquidNetwork_TimestampView.svelte',
		list: '$/views-new/HyperliquidNetwork_TimestampsView.svelte',
	},
	[EntityType.HyperliquidOrder]: {
		detail: '$/views-new/HyperliquidOrderView.svelte',
		list: '$/views-new/HyperliquidOrdersView.svelte',
	},
	[EntityType.HyperliquidOrder_Timestamp]: {
		detail: '$/views-new/HyperliquidOrder_TimestampView.svelte',
		list: '$/views-new/HyperliquidOrder_TimestampsView.svelte',
	},
	[EntityType.HyperliquidOrderbook_Timestamp]: {
		detail: '$/views-new/HyperliquidOrderbook_TimestampView.svelte',
	},
	[EntityType.HyperliquidPerpMarket]: {
		detail: '$/views-new/HyperliquidPerpMarketView.svelte',
		list: '$/views-new/HyperliquidPerpMarketsView.svelte',
	},
	[EntityType.HyperliquidPerpMarket_Timestamp]: {
		detail: '$/views-new/HyperliquidPerpMarket_TimestampView.svelte',
		list: '$/views-new/HyperliquidPerpMarket_TimestampsView.svelte',
	},
	[EntityType.HyperliquidSpotAsset]: {
		detail: '$/views-new/HyperliquidSpotAssetView.svelte',
		list: '$/views-new/HyperliquidSpotAssetsView.svelte',
	},
	[EntityType.HyperliquidSpotAsset_Timestamp]: {
		detail: '$/views-new/HyperliquidSpotAsset_TimestampView.svelte',
		list: '$/views-new/HyperliquidSpotAsset_TimestampsView.svelte',
	},
	[EntityType.HyperliquidSpotPair]: {
		detail: '$/views-new/HyperliquidSpotPairView.svelte',
		list: '$/views-new/HyperliquidSpotPairsView.svelte',
	},
	[EntityType.HyperliquidSpotPair_Timestamp]: {
		detail: '$/views-new/HyperliquidSpotPair_TimestampView.svelte',
		list: '$/views-new/HyperliquidSpotPair_TimestampsView.svelte',
	},
	[EntityType.HyperliquidTransaction]: {
		detail: '$/views-new/HyperliquidTransactionView.svelte',
		list: '$/views-new/HyperliquidTransactionsView.svelte',
	},
	[EntityType.HyperliquidTransaction_Timestamp]: {
		detail: '$/views-new/HyperliquidTransaction_TimestampView.svelte',
		list: '$/views-new/HyperliquidTransaction_TimestampsView.svelte',
	},
	[EntityType.HyperliquidValidator]: {
		detail: '$/views-new/HyperliquidValidatorView.svelte',
		list: '$/views-new/HyperliquidValidatorsView.svelte',
	},
	[EntityType.HyperliquidValidator_Timestamp]: {
		detail: '$/views-new/HyperliquidValidator_TimestampView.svelte',
		list: '$/views-new/HyperliquidValidator_TimestampsView.svelte',
	},
	[EntityType.HyperliquidVault]: {
		detail: '$/views-new/HyperliquidVaultView.svelte',
		list: '$/views-new/HyperliquidVaultsView.svelte',
	},
	[EntityType.HyperliquidVaultEquity_Timestamp]: {
		detail: '$/views-new/HyperliquidVaultEquity_TimestampView.svelte',
		list: '$/views-new/HyperliquidVaultEquity_TimestampsView.svelte',
	},
	[EntityType.HyperliquidVault_Timestamp]: {
		detail: '$/views-new/HyperliquidVault_TimestampView.svelte',
		list: '$/views-new/HyperliquidVault_TimestampsView.svelte',
	},
	[EntityType.IbcChannel]: {
		detail: '$/views-new/IbcChannelView.svelte',
		list: '$/views-new/IbcChannelsView.svelte',
	},
	[EntityType.IbcClient]: {
		detail: '$/views-new/IbcClientView.svelte',
	},
	[EntityType.IbcConnection]: {
		detail: '$/views-new/IbcConnectionView.svelte',
		list: '$/views-new/IbcConnectionsView.svelte',
	},
	[EntityType.IbcDenomTrace]: {
		detail: '$/views-new/IbcDenomTraceView.svelte',
	},
	[EntityType.IbcPacket]: {
		detail: '$/views-new/IbcPacketView.svelte',
		list: '$/views-new/IbcPacketsView.svelte',
	},
	[EntityType.IcpCanister]: {
		detail: '$/views-new/IcpCanisterView.svelte',
		list: '$/views-new/IcpCanistersView.svelte',
	},
	[EntityType.IcpCanisterLog_Timestamp]: {
		detail: '$/views-new/IcpCanisterLog_TimestampView.svelte',
		list: '$/views-new/IcpCanisterLog_TimestampsView.svelte',
	},
	[EntityType.IcpCanisterMetadata]: {
		detail: '$/views-new/IcpCanisterMetadataView.svelte',
		list: '$/views-new/IcpCanisterMetadatasView.svelte',
	},
	[EntityType.IcpCanisterMetadata_Timestamp]: {
		detail: '$/views-new/IcpCanisterMetadata_TimestampView.svelte',
		list: '$/views-new/IcpCanisterMetadata_TimestampsView.svelte',
	},
	[EntityType.IcpCanisterMethod]: {
		detail: '$/views-new/IcpCanisterMethodView.svelte',
		list: '$/views-new/IcpCanisterMethodsView.svelte',
	},
	[EntityType.IcpCanisterMethod_Timestamp]: {
		detail: '$/views-new/IcpCanisterMethod_TimestampView.svelte',
		list: '$/views-new/IcpCanisterMethod_TimestampsView.svelte',
	},
	[EntityType.IcpCanister_Timestamp]: {
		detail: '$/views-new/IcpCanister_TimestampView.svelte',
		list: '$/views-new/IcpCanister_TimestampsView.svelte',
	},
	[EntityType.IcpCertifiedState]: {
		detail: '$/views-new/IcpCertifiedStateView.svelte',
		list: '$/views-new/IcpCertifiedStatesView.svelte',
	},
	[EntityType.IcpLedgerAccount_Timestamp]: {
		detail: '$/views-new/IcpLedgerAccount_TimestampView.svelte',
		list: '$/views-new/IcpLedgerAccount_TimestampsView.svelte',
	},
	[EntityType.IcpLedgerBlock]: {
		detail: '$/views-new/IcpLedgerBlockView.svelte',
		list: '$/views-new/IcpLedgerBlocksView.svelte',
	},
	[EntityType.IcpLedgerCanister]: {
		detail: '$/views-new/IcpLedgerCanisterView.svelte',
		list: '$/views-new/IcpLedgerCanistersView.svelte',
	},
	[EntityType.IcpLedgerCanister_Timestamp]: {
		detail: '$/views-new/IcpLedgerCanister_TimestampView.svelte',
		list: '$/views-new/IcpLedgerCanister_TimestampsView.svelte',
	},
	[EntityType.IcpLedgerTransaction]: {
		detail: '$/views-new/IcpLedgerTransactionView.svelte',
		list: '$/views-new/IcpLedgerTransactionsView.svelte',
	},
	[EntityType.IcpNetwork]: {
		detail: '$/views-new/IcpNetworkView.svelte',
	},
	[EntityType.IcpNetwork_Timestamp]: {
		detail: '$/views-new/IcpNetwork_TimestampView.svelte',
		list: '$/views-new/IcpNetwork_TimestampsView.svelte',
	},
	[EntityType.IcpRequestStatus]: {
		detail: '$/views-new/IcpRequestStatusView.svelte',
		list: '$/views-new/IcpRequestStatussView.svelte',
	},
	[EntityType.IcpRequestStatus_Timestamp]: {
		detail: '$/views-new/IcpRequestStatus_TimestampView.svelte',
		list: '$/views-new/IcpRequestStatus_TimestampsView.svelte',
	},
	[EntityType.IcpSubnet]: {
		detail: '$/views-new/IcpSubnetView.svelte',
		list: '$/views-new/IcpSubnetsView.svelte',
	},
	[EntityType.IcpSubnetCanisterRange_Timestamp]: {
		detail: '$/views-new/IcpSubnetCanisterRange_TimestampView.svelte',
		list: '$/views-new/IcpSubnetCanisterRange_TimestampsView.svelte',
	},
	[EntityType.IcpSubnet_Timestamp]: {
		detail: '$/views-new/IcpSubnet_TimestampView.svelte',
		list: '$/views-new/IcpSubnet_TimestampsView.svelte',
	},
	[EntityType.IpfsProtocol]: {
		detail: '$/views-new/IpfsProtocolView.svelte',
	},
	[EntityType.IpfsResource]: {
		detail: '$/views-new/IpfsResourceView.svelte',
		list: '$/views-new/IpfsResourcesView.svelte',
	},
	[EntityType.IssuerAction]: {
		detail: '$/views-new/IssuerActionView.svelte',
	},
	[EntityType.IssuerPower]: {
		detail: '$/views-new/IssuerPowerView.svelte',
		list: '$/views-new/IssuerPowersView.svelte',
	},
	[EntityType.KaspaAcceptedTransaction]: {
		detail: '$/views-new/KaspaAcceptedTransactionView.svelte',
		list: '$/views-new/KaspaAcceptedTransactionsView.svelte',
	},
	[EntityType.KaspaAddress]: {
		detail: '$/views-new/KaspaAddressView.svelte',
		list: '$/views-new/KaspaAddresssView.svelte',
	},
	[EntityType.KaspaAddressUtxo_Timestamp]: {
		detail: '$/views-new/KaspaAddressUtxo_TimestampView.svelte',
		list: '$/views-new/KaspaAddressUtxo_TimestampsView.svelte',
	},
	[EntityType.KaspaAddress_Timestamp]: {
		detail: '$/views-new/KaspaAddress_TimestampView.svelte',
		list: '$/views-new/KaspaAddress_TimestampsView.svelte',
	},
	[EntityType.KaspaBlock]: {
		detail: '$/views-new/KaspaBlockView.svelte',
		list: '$/views-new/KaspaBlocksView.svelte',
	},
	[EntityType.KaspaNetwork]: {
		detail: '$/views-new/KaspaNetworkView.svelte',
	},
	[EntityType.KaspaNetwork_Timestamp]: {
		detail: '$/views-new/KaspaNetwork_TimestampView.svelte',
		list: '$/views-new/KaspaNetwork_TimestampsView.svelte',
	},
	[EntityType.KaspaTransaction]: {
		detail: '$/views-new/KaspaTransactionView.svelte',
		list: '$/views-new/KaspaTransactionsView.svelte',
	},
	[EntityType.KaspaVirtualChain_Timestamp]: {
		detail: '$/views-new/KaspaVirtualChain_TimestampView.svelte',
		list: '$/views-new/KaspaVirtualChain_TimestampsView.svelte',
	},
	[EntityType.LensAccount]: {
		detail: '$/views-new/LensAccountView.svelte',
		list: '$/views-new/LensAccountsView.svelte',
	},
	[EntityType.LensAccountManager]: {
		detail: '$/views-new/LensAccountManagerView.svelte',
		list: '$/views-new/LensAccountManagersView.svelte',
	},
	[EntityType.LensAccount_Timestamp]: {
		detail: '$/views-new/LensAccount_TimestampView.svelte',
		list: '$/views-new/LensAccount_TimestampsView.svelte',
	},
	[EntityType.LensFeed]: {
		detail: '$/views-new/LensFeedView.svelte',
		list: '$/views-new/LensFeedsView.svelte',
	},
	[EntityType.LensNetwork]: {
		detail: '$/views-new/LensNetworkView.svelte',
	},
	[EntityType.LensPost]: {
		detail: '$/views-new/LensPostView.svelte',
		list: '$/views-new/LensPostsView.svelte',
	},
	[EntityType.LensPost_Timestamp]: {
		detail: '$/views-new/LensPost_TimestampView.svelte',
		list: '$/views-new/LensPost_TimestampsView.svelte',
	},
	[EntityType.LensUsername]: {
		detail: '$/views-new/LensUsernameView.svelte',
		list: '$/views-new/LensUsernamesView.svelte',
	},
	[EntityType.LensUsernameNamespace]: {
		detail: '$/views-new/LensUsernameNamespaceView.svelte',
		list: '$/views-new/LensUsernameNamespacesView.svelte',
	},
	[EntityType.Leverage]: {
		detail: '$/views-new/LeverageView.svelte',
	},
	[EntityType.LightningChannel]: {
		detail: '$/views-new/LightningChannelView.svelte',
		list: '$/views-new/LightningChannelsView.svelte',
	},
	[EntityType.LightningChannel_Timestamp]: {
		detail: '$/views-new/LightningChannel_TimestampView.svelte',
		list: '$/views-new/LightningChannel_TimestampsView.svelte',
	},
	[EntityType.LightningNetwork]: {
		detail: '$/views-new/LightningNetworkView.svelte',
	},
	[EntityType.LightningNetwork_Timestamp]: {
		detail: '$/views-new/LightningNetwork_TimestampView.svelte',
		list: '$/views-new/LightningNetwork_TimestampsView.svelte',
	},
	[EntityType.LightningNode]: {
		detail: '$/views-new/LightningNodeView.svelte',
		list: '$/views-new/LightningNodesView.svelte',
	},
	[EntityType.LightningNode_Timestamp]: {
		detail: '$/views-new/LightningNode_TimestampView.svelte',
		list: '$/views-new/LightningNode_TimestampsView.svelte',
	},
	[EntityType.LiquidityPool]: {
		detail: '$/views-new/LiquidityPoolView.svelte',
		list: '$/views-new/LiquidityPoolsView.svelte',
	},
	[EntityType.LiquidityPool_Block]: {
		detail: '$/views-new/LiquidityPool_BlockView.svelte',
		list: '$/views-new/LiquidityPool_BlocksView.svelte',
	},
	[EntityType.LiquidityPool_Timestamp]: {
		detail: '$/views-new/LiquidityPool_TimestampView.svelte',
		list: '$/views-new/LiquidityPool_TimestampsView.svelte',
	},
	[EntityType.LiquidityPosition]: {
		detail: '$/views-new/LiquidityPositionView.svelte',
		list: '$/views-new/LiquidityPositionsView.svelte',
	},
	[EntityType.LiquidityPosition_Block]: {
		detail: '$/views-new/LiquidityPosition_BlockView.svelte',
		list: '$/views-new/LiquidityPosition_BlocksView.svelte',
	},
	[EntityType.LitecoinMwebBlock]: {
		detail: '$/views-new/LitecoinMwebBlockView.svelte',
	},
	[EntityType.LitecoinMwebOutput]: {
		detail: '$/views-new/LitecoinMwebOutputView.svelte',
		list: '$/views-new/LitecoinMwebOutputsView.svelte',
	},
	[EntityType.LitecoinMwebPegIn]: {
		detail: '$/views-new/LitecoinMwebPegInView.svelte',
		list: '$/views-new/LitecoinMwebPegInsView.svelte',
	},
	[EntityType.LitecoinMwebPegOut]: {
		detail: '$/views-new/LitecoinMwebPegOutView.svelte',
		list: '$/views-new/LitecoinMwebPegOutsView.svelte',
	},
	[EntityType.LitecoinMwebTransaction]: {
		detail: '$/views-new/LitecoinMwebTransactionView.svelte',
		list: '$/views-new/LitecoinMwebTransactionsView.svelte',
	},
	[EntityType.LogosBlockchainNetwork]: {
		detail: '$/views-new/LogosBlockchainNetworkView.svelte',
	},
	[EntityType.LogosBlockchainNetwork_Timestamp]: {
		detail: '$/views-new/LogosBlockchainNetwork_TimestampView.svelte',
		list: '$/views-new/LogosBlockchainNetwork_TimestampsView.svelte',
	},
	[EntityType.MagnetLink]: {
		detail: '$/views-new/MagnetLinkView.svelte',
		list: '$/views-new/MagnetLinksView.svelte',
	},
	[EntityType.MagnetResolution_Timestamp]: {
		detail: '$/views-new/MagnetResolution_TimestampView.svelte',
		list: '$/views-new/MagnetResolution_TimestampsView.svelte',
	},
	[EntityType.Market]: {
		detail: '$/views-new/MarketView.svelte',
		list: '$/views-new/MarketsView.svelte',
	},
	[EntityType.MarketPrice]: {
		detail: '$/views-new/MarketPriceView.svelte',
		list: '$/views-new/MarketPricesView.svelte',
	},
	[EntityType.MarketVenue]: {
		detail: '$/views-new/MarketVenueView.svelte',
		list: '$/views-new/MarketVenuesView.svelte',
	},
	[EntityType.Market_Derivative_Timestamp]: {
		detail: '$/views-new/Market_Derivative_TimestampView.svelte',
		list: '$/views-new/Market_Derivative_TimestampsView.svelte',
	},
	[EntityType.Market_TimeInterval_Timestamp]: {
		detail: '$/views-new/Market_TimeInterval_TimestampView.svelte',
		list: '$/views-new/Market_TimeInterval_TimestampsView.svelte',
	},
	[EntityType.Market_Timestamp]: {
		detail: '$/views-new/Market_TimestampView.svelte',
		list: '$/views-new/Market_TimestampsView.svelte',
	},
	[EntityType.McpPrompt]: {
		detail: '$/views-new/McpPromptView.svelte',
		list: '$/views-new/McpPromptsView.svelte',
	},
	[EntityType.McpPromptResult]: {
		detail: '$/views-new/McpPromptResultView.svelte',
		list: '$/views-new/McpPromptResultsView.svelte',
	},
	[EntityType.McpResource]: {
		detail: '$/views-new/McpResourceView.svelte',
		list: '$/views-new/McpResourcesView.svelte',
	},
	[EntityType.McpResourceContent_Timestamp]: {
		detail: '$/views-new/McpResourceContent_TimestampView.svelte',
		list: '$/views-new/McpResourceContent_TimestampsView.svelte',
	},
	[EntityType.McpResourceTemplate]: {
		detail: '$/views-new/McpResourceTemplateView.svelte',
		list: '$/views-new/McpResourceTemplatesView.svelte',
	},
	[EntityType.McpServer]: {
		detail: '$/views-new/McpServerView.svelte',
		list: '$/views-new/McpServersView.svelte',
	},
	[EntityType.McpServerPackage]: {
		detail: '$/views-new/McpServerPackageView.svelte',
	},
	[EntityType.McpServerPackageVersion]: {
		detail: '$/views-new/McpServerPackageVersionView.svelte',
		list: '$/views-new/McpServerPackageVersionsView.svelte',
	},
	[EntityType.McpServer_Timestamp]: {
		detail: '$/views-new/McpServer_TimestampView.svelte',
		list: '$/views-new/McpServer_TimestampsView.svelte',
	},
	[EntityType.McpTool]: {
		detail: '$/views-new/McpToolView.svelte',
		list: '$/views-new/McpToolsView.svelte',
	},
	[EntityType.McpToolCall]: {
		detail: '$/views-new/McpToolCallView.svelte',
	},
	[EntityType.McpToolCall_Timestamp]: {
		detail: '$/views-new/McpToolCall_TimestampView.svelte',
		list: '$/views-new/McpToolCall_TimestampsView.svelte',
	},
	[EntityType.Media]: {
		detail: '$/views-new/MediaView.svelte',
		list: '$/views-new/MediasView.svelte',
	},
	[EntityType.MediaObject]: {
		detail: '$/views-new/MediaObjectView.svelte',
	},
	[EntityType.MevBuilder]: {
		detail: '$/views-new/MevBuilderView.svelte',
		list: '$/views-new/MevBuildersView.svelte',
	},
	[EntityType.MevBuilder_Timestamp]: {
		detail: '$/views-new/MevBuilder_TimestampView.svelte',
		list: '$/views-new/MevBuilder_TimestampsView.svelte',
	},
	[EntityType.MevRelay]: {
		detail: '$/views-new/MevRelayView.svelte',
		list: '$/views-new/MevRelaysView.svelte',
	},
	[EntityType.MevRelay_ProposerPayloadDelivered]: {
		detail: '$/views-new/MevRelay_ProposerPayloadDeliveredView.svelte',
		list: '$/views-new/MevRelay_ProposerPayloadDeliveredsView.svelte',
	},
	[EntityType.MevRelay_Timestamp]: {
		detail: '$/views-new/MevRelay_TimestampView.svelte',
		list: '$/views-new/MevRelay_TimestampsView.svelte',
	},
	[EntityType.MoneroBlock]: {
		detail: '$/views-new/MoneroBlockView.svelte',
		list: '$/views-new/MoneroBlocksView.svelte',
	},
	[EntityType.MoneroKeyImage]: {
		detail: '$/views-new/MoneroKeyImageView.svelte',
		list: '$/views-new/MoneroKeyImagesView.svelte',
	},
	[EntityType.MoneroNetwork]: {
		detail: '$/views-new/MoneroNetworkView.svelte',
	},
	[EntityType.MoneroNetwork_Timestamp]: {
		detail: '$/views-new/MoneroNetwork_TimestampView.svelte',
		list: '$/views-new/MoneroNetwork_TimestampsView.svelte',
	},
	[EntityType.MoneroRing]: {
		detail: '$/views-new/MoneroRingView.svelte',
	},
	[EntityType.MoneroRingMember]: {
		detail: '$/views-new/MoneroRingMemberView.svelte',
		list: '$/views-new/MoneroRingMembersView.svelte',
	},
	[EntityType.MoneroStealthOutput]: {
		detail: '$/views-new/MoneroStealthOutputView.svelte',
		list: '$/views-new/MoneroStealthOutputsView.svelte',
	},
	[EntityType.MoneroTransaction]: {
		detail: '$/views-new/MoneroTransactionView.svelte',
		list: '$/views-new/MoneroTransactionsView.svelte',
	},
	[EntityType.MoveFunction]: {
		detail: '$/views-new/MoveFunctionView.svelte',
		list: '$/views-new/MoveFunctionsView.svelte',
	},
	[EntityType.MoveModule]: {
		detail: '$/views-new/MoveModuleView.svelte',
		list: '$/views-new/MoveModulesView.svelte',
	},
	[EntityType.MoveModule_Timestamp]: {
		detail: '$/views-new/MoveModule_TimestampView.svelte',
		list: '$/views-new/MoveModule_TimestampsView.svelte',
	},
	[EntityType.MoveStruct]: {
		detail: '$/views-new/MoveStructView.svelte',
		list: '$/views-new/MoveStructsView.svelte',
	},
	[EntityType.NearAccessKey]: {
		detail: '$/views-new/NearAccessKeyView.svelte',
		list: '$/views-new/NearAccessKeysView.svelte',
	},
	[EntityType.NearAccessKey_Timestamp]: {
		detail: '$/views-new/NearAccessKey_TimestampView.svelte',
	},
	[EntityType.NearAccount]: {
		detail: '$/views-new/NearAccountView.svelte',
	},
	[EntityType.NearAccount_Timestamp]: {
		detail: '$/views-new/NearAccount_TimestampView.svelte',
	},
	[EntityType.NearAction]: {
		detail: '$/views-new/NearActionView.svelte',
		list: '$/views-new/NearActionsView.svelte',
	},
	[EntityType.NearBlock]: {
		detail: '$/views-new/NearBlockView.svelte',
		list: '$/views-new/NearBlocksView.svelte',
	},
	[EntityType.NearChunk]: {
		detail: '$/views-new/NearChunkView.svelte',
		list: '$/views-new/NearChunksView.svelte',
	},
	[EntityType.NearContract]: {
		detail: '$/views-new/NearContractView.svelte',
	},
	[EntityType.NearContractStorageEntry]: {
		detail: '$/views-new/NearContractStorageEntryView.svelte',
	},
	[EntityType.NearContract_Timestamp]: {
		detail: '$/views-new/NearContract_TimestampView.svelte',
	},
	[EntityType.NearExecutionOutcome]: {
		detail: '$/views-new/NearExecutionOutcomeView.svelte',
		list: '$/views-new/NearExecutionOutcomesView.svelte',
	},
	[EntityType.NearNetwork]: {
		detail: '$/views-new/NearNetworkView.svelte',
	},
	[EntityType.NearNetwork_Timestamp]: {
		detail: '$/views-new/NearNetwork_TimestampView.svelte',
		list: '$/views-new/NearNetwork_TimestampsView.svelte',
	},
	[EntityType.NearReceipt]: {
		detail: '$/views-new/NearReceiptView.svelte',
		list: '$/views-new/NearReceiptsView.svelte',
	},
	[EntityType.NearTransaction]: {
		detail: '$/views-new/NearTransactionView.svelte',
		list: '$/views-new/NearTransactionsView.svelte',
	},
	[EntityType.NearValidator]: {
		detail: '$/views-new/NearValidatorView.svelte',
		list: '$/views-new/NearValidatorsView.svelte',
	},
	[EntityType.NearValidator_Timestamp]: {
		detail: '$/views-new/NearValidator_TimestampView.svelte',
	},
	[EntityType.Network]: {
		detail: '$/views-new/NetworkView.svelte',
		list: '$/views-new/NetworksView.svelte',
	},
	[EntityType.NetworkEndpointObservation_Timestamp]: {
		detail: '$/views-new/NetworkEndpointObservation_TimestampView.svelte',
	},
	[EntityType.NetworkStack]: {
		detail: '$/views-new/NetworkStackView.svelte',
	},
	[EntityType.NetworkUpgrade]: {
		detail: '$/views-new/NetworkUpgradeView.svelte',
	},
	[EntityType.NetworkUpgrade_Timestamp]: {
		detail: '$/views-new/NetworkUpgrade_TimestampView.svelte',
		list: '$/views-new/NetworkUpgrade_TimestampsView.svelte',
	},
	[EntityType.Network_Timestamp]: {
		detail: '$/views-new/Network_TimestampView.svelte',
		list: '$/views-new/Network_TimestampsView.svelte',
	},
	[EntityType.NftCollection]: {
		detail: '$/views-new/NftCollectionView.svelte',
	},
	[EntityType.NftToken]: {
		detail: '$/views-new/NftTokenView.svelte',
		list: '$/views-new/NftTokensView.svelte',
	},
	[EntityType.NostrArticle]: {
		detail: '$/views-new/NostrArticleView.svelte',
		list: '$/views-new/NostrArticlesView.svelte',
	},
	[EntityType.NostrNetwork]: {
		detail: '$/views-new/NostrNetworkView.svelte',
	},
	[EntityType.NostrNote]: {
		detail: '$/views-new/NostrNoteView.svelte',
		list: '$/views-new/NostrNotesView.svelte',
	},
	[EntityType.NostrProfile]: {
		detail: '$/views-new/NostrProfileView.svelte',
		list: '$/views-new/NostrProfilesView.svelte',
	},
	[EntityType.NostrReaction]: {
		detail: '$/views-new/NostrReactionView.svelte',
		list: '$/views-new/NostrReactionsView.svelte',
	},
	[EntityType.NostrRelay]: {
		detail: '$/views-new/NostrRelayView.svelte',
		list: '$/views-new/NostrRelaysView.svelte',
	},
	[EntityType.NostrRelay_Timestamp]: {
		detail: '$/views-new/NostrRelay_TimestampView.svelte',
		list: '$/views-new/NostrRelay_TimestampsView.svelte',
	},
	[EntityType.NostrRepost]: {
		detail: '$/views-new/NostrRepostView.svelte',
		list: '$/views-new/NostrRepostsView.svelte',
	},
	[EntityType.OracleFeed]: {
		detail: '$/views-new/OracleFeedView.svelte',
		list: '$/views-new/OracleFeedsView.svelte',
	},
	[EntityType.OracleFeed_Round]: {
		detail: '$/views-new/OracleFeed_RoundView.svelte',
		list: '$/views-new/OracleFeed_RoundsView.svelte',
	},
	[EntityType.OracleFeed_Timestamp]: {
		detail: '$/views-new/OracleFeed_TimestampView.svelte',
		list: '$/views-new/OracleFeed_TimestampsView.svelte',
	},
	[EntityType.PayjoinDirectory]: {
		detail: '$/views-new/PayjoinDirectoryView.svelte',
	},
	[EntityType.PayjoinEndpoint]: {
		detail: '$/views-new/PayjoinEndpointView.svelte',
	},
	[EntityType.PayjoinEndpoint_Timestamp]: {
		detail: '$/views-new/PayjoinEndpoint_TimestampView.svelte',
		list: '$/views-new/PayjoinEndpoint_TimestampsView.svelte',
	},
	[EntityType.Payout]: {
		detail: '$/views-new/PayoutView.svelte',
	},
	[EntityType.PayoutClaim_Timestamp]: {
		detail: '$/views-new/PayoutClaim_TimestampView.svelte',
		list: '$/views-new/PayoutClaim_TimestampsView.svelte',
	},
	[EntityType.PolkadotAccount]: {
		detail: '$/views-new/PolkadotAccountView.svelte',
	},
	[EntityType.PolkadotAccount_Timestamp]: {
		detail: '$/views-new/PolkadotAccount_TimestampView.svelte',
		list: '$/views-new/PolkadotAccount_TimestampsView.svelte',
	},
	[EntityType.PolkadotAsset]: {
		detail: '$/views-new/PolkadotAssetView.svelte',
		list: '$/views-new/PolkadotAssetsView.svelte',
	},
	[EntityType.PolkadotAssetBalance_Timestamp]: {
		detail: '$/views-new/PolkadotAssetBalance_TimestampView.svelte',
		list: '$/views-new/PolkadotAssetBalance_TimestampsView.svelte',
	},
	[EntityType.PolkadotAsset_Timestamp]: {
		detail: '$/views-new/PolkadotAsset_TimestampView.svelte',
		list: '$/views-new/PolkadotAsset_TimestampsView.svelte',
	},
	[EntityType.PolkadotBlock]: {
		detail: '$/views-new/PolkadotBlockView.svelte',
		list: '$/views-new/PolkadotBlocksView.svelte',
	},
	[EntityType.PolkadotEvent]: {
		detail: '$/views-new/PolkadotEventView.svelte',
		list: '$/views-new/PolkadotEventsView.svelte',
	},
	[EntityType.PolkadotExtrinsic]: {
		detail: '$/views-new/PolkadotExtrinsicView.svelte',
		list: '$/views-new/PolkadotExtrinsicsView.svelte',
	},
	[EntityType.PolkadotNetwork]: {
		detail: '$/views-new/PolkadotNetworkView.svelte',
	},
	[EntityType.PolkadotNetwork_Timestamp]: {
		detail: '$/views-new/PolkadotNetwork_TimestampView.svelte',
		list: '$/views-new/PolkadotNetwork_TimestampsView.svelte',
	},
	[EntityType.PolkadotPallet]: {
		detail: '$/views-new/PolkadotPalletView.svelte',
	},
	[EntityType.PolkadotReferendum]: {
		detail: '$/views-new/PolkadotReferendumView.svelte',
	},
	[EntityType.PolkadotReferendum_Timestamp]: {
		detail: '$/views-new/PolkadotReferendum_TimestampView.svelte',
		list: '$/views-new/PolkadotReferendum_TimestampsView.svelte',
	},
	[EntityType.PolkadotValidator]: {
		detail: '$/views-new/PolkadotValidatorView.svelte',
		list: '$/views-new/PolkadotValidatorsView.svelte',
	},
	[EntityType.PolkadotValidator_Era]: {
		detail: '$/views-new/PolkadotValidator_EraView.svelte',
		list: '$/views-new/PolkadotValidator_ErasView.svelte',
	},
	[EntityType.PythPriceFeed]: {
		detail: '$/views-new/PythPriceFeedView.svelte',
	},
	[EntityType.PythPriceFeed_Timestamp]: {
		detail: '$/views-new/PythPriceFeed_TimestampView.svelte',
		list: '$/views-new/PythPriceFeed_TimestampsView.svelte',
	},
	[EntityType.QuilibriumAccount]: {
		detail: '$/views-new/QuilibriumAccountView.svelte',
	},
	[EntityType.QuilibriumFrame]: {
		detail: '$/views-new/QuilibriumFrameView.svelte',
		list: '$/views-new/QuilibriumFramesView.svelte',
	},
	[EntityType.QuilibriumProver]: {
		detail: '$/views-new/QuilibriumProverView.svelte',
		list: '$/views-new/QuilibriumProversView.svelte',
	},
	[EntityType.QuilibriumShard]: {
		detail: '$/views-new/QuilibriumShardView.svelte',
	},
	[EntityType.RadicleCollaborationEvent]: {
		detail: '$/views-new/RadicleCollaborationEventView.svelte',
	},
	[EntityType.RadicleDelegate]: {
		detail: '$/views-new/RadicleDelegateView.svelte',
		list: '$/views-new/RadicleDelegatesView.svelte',
	},
	[EntityType.RadicleDiscussionComment]: {
		detail: '$/views-new/RadicleDiscussionCommentView.svelte',
		list: '$/views-new/RadicleDiscussionCommentsView.svelte',
	},
	[EntityType.RadicleIdentityDocument]: {
		detail: '$/views-new/RadicleIdentityDocumentView.svelte',
	},
	[EntityType.RadicleIdentityRevision]: {
		detail: '$/views-new/RadicleIdentityRevisionView.svelte',
	},
	[EntityType.RadicleIssue]: {
		detail: '$/views-new/RadicleIssueView.svelte',
		list: '$/views-new/RadicleIssuesView.svelte',
	},
	[EntityType.RadiclePatch]: {
		detail: '$/views-new/RadiclePatchView.svelte',
		list: '$/views-new/RadiclePatchsView.svelte',
	},
	[EntityType.RadicleRepository]: {
		detail: '$/views-new/RadicleRepositoryView.svelte',
	},
	[EntityType.RadicleSignedRef]: {
		detail: '$/views-new/RadicleSignedRefView.svelte',
		list: '$/views-new/RadicleSignedRefsView.svelte',
	},
	[EntityType.RadicleSignedRef_Timestamp]: {
		detail: '$/views-new/RadicleSignedRef_TimestampView.svelte',
		list: '$/views-new/RadicleSignedRef_TimestampsView.svelte',
	},
	[EntityType.RedditComment]: {
		detail: '$/views-new/RedditCommentView.svelte',
		list: '$/views-new/RedditCommentsView.svelte',
	},
	[EntityType.RedditComment_Timestamp]: {
		detail: '$/views-new/RedditComment_TimestampView.svelte',
		list: '$/views-new/RedditComment_TimestampsView.svelte',
	},
	[EntityType.RedditLink]: {
		detail: '$/views-new/RedditLinkView.svelte',
		list: '$/views-new/RedditLinksView.svelte',
	},
	[EntityType.RedditLink_Timestamp]: {
		detail: '$/views-new/RedditLink_TimestampView.svelte',
		list: '$/views-new/RedditLink_TimestampsView.svelte',
	},
	[EntityType.RedditNetwork]: {
		detail: '$/views-new/RedditNetworkView.svelte',
	},
	[EntityType.RedditSubreddit]: {
		detail: '$/views-new/RedditSubredditView.svelte',
		list: '$/views-new/RedditSubredditsView.svelte',
	},
	[EntityType.RedditSubreddit_Timestamp]: {
		detail: '$/views-new/RedditSubreddit_TimestampView.svelte',
		list: '$/views-new/RedditSubreddit_TimestampsView.svelte',
	},
	[EntityType.RegulatedAssetProfile]: {
		detail: '$/views-new/RegulatedAssetProfileView.svelte',
	},
	[EntityType.RegulatedAssetProfile_Timestamp]: {
		detail: '$/views-new/RegulatedAssetProfile_TimestampView.svelte',
		list: '$/views-new/RegulatedAssetProfile_TimestampsView.svelte',
	},
	[EntityType.RoyaltyRight_Timestamp]: {
		detail: '$/views-new/RoyaltyRight_TimestampView.svelte',
		list: '$/views-new/RoyaltyRight_TimestampsView.svelte',
	},
	[EntityType.RssFeed]: {
		detail: '$/views-new/RssFeedView.svelte',
		list: '$/views-new/RssFeedsView.svelte',
	},
	[EntityType.RssFeed_Timestamp]: {
		detail: '$/views-new/RssFeed_TimestampView.svelte',
	},
	[EntityType.RssItem]: {
		detail: '$/views-new/RssItemView.svelte',
		list: '$/views-new/RssItemsView.svelte',
	},
	[EntityType.RssItem_Timestamp]: {
		detail: '$/views-new/RssItem_TimestampView.svelte',
	},
	[EntityType.RssNetwork]: {
		detail: '$/views-new/RssNetworkView.svelte',
	},
	[EntityType.ScalingDeploymentClaim]: {
		detail: '$/views-new/ScalingDeploymentClaimView.svelte',
	},
	[EntityType.ScalingDeploymentClaim_Timestamp]: {
		detail: '$/views-new/ScalingDeploymentClaim_TimestampView.svelte',
		list: '$/views-new/ScalingDeploymentClaim_TimestampsView.svelte',
	},
	[EntityType.SolanaAccount]: {
		detail: '$/views-new/SolanaAccountView.svelte',
		list: '$/views-new/SolanaAccountsView.svelte',
	},
	[EntityType.SolanaAccount_Timestamp]: {
		detail: '$/views-new/SolanaAccount_TimestampView.svelte',
		list: '$/views-new/SolanaAccount_TimestampsView.svelte',
	},
	[EntityType.SolanaBlock]: {
		detail: '$/views-new/SolanaBlockView.svelte',
		list: '$/views-new/SolanaBlocksView.svelte',
	},
	[EntityType.SolanaInstruction]: {
		detail: '$/views-new/SolanaInstructionView.svelte',
		list: '$/views-new/SolanaInstructionsView.svelte',
	},
	[EntityType.SolanaNetwork]: {
		detail: '$/views-new/SolanaNetworkView.svelte',
	},
	[EntityType.SolanaNetwork_Timestamp]: {
		detail: '$/views-new/SolanaNetwork_TimestampView.svelte',
		list: '$/views-new/SolanaNetwork_TimestampsView.svelte',
	},
	[EntityType.SolanaProgram]: {
		detail: '$/views-new/SolanaProgramView.svelte',
	},
	[EntityType.SolanaTokenAccount]: {
		detail: '$/views-new/SolanaTokenAccountView.svelte',
		list: '$/views-new/SolanaTokenAccountsView.svelte',
	},
	[EntityType.SolanaTokenAccount_Timestamp]: {
		detail: '$/views-new/SolanaTokenAccount_TimestampView.svelte',
		list: '$/views-new/SolanaTokenAccount_TimestampsView.svelte',
	},
	[EntityType.SolanaTokenMint]: {
		detail: '$/views-new/SolanaTokenMintView.svelte',
		list: '$/views-new/SolanaTokenMintsView.svelte',
	},
	[EntityType.SolanaTokenMint_Timestamp]: {
		detail: '$/views-new/SolanaTokenMint_TimestampView.svelte',
		list: '$/views-new/SolanaTokenMint_TimestampsView.svelte',
	},
	[EntityType.SolanaTransaction]: {
		detail: '$/views-new/SolanaTransactionView.svelte',
		list: '$/views-new/SolanaTransactionsView.svelte',
	},
	[EntityType.SolanaTransaction_Timestamp]: {
		detail: '$/views-new/SolanaTransaction_TimestampView.svelte',
		list: '$/views-new/SolanaTransaction_TimestampsView.svelte',
	},
	[EntityType.SolanaValidator]: {
		detail: '$/views-new/SolanaValidatorView.svelte',
		list: '$/views-new/SolanaValidatorsView.svelte',
	},
	[EntityType.SolanaValidator_Timestamp]: {
		detail: '$/views-new/SolanaValidator_TimestampView.svelte',
		list: '$/views-new/SolanaValidator_TimestampsView.svelte',
	},
	[EntityType.SorobanContract]: {
		detail: '$/views-new/SorobanContractView.svelte',
		list: '$/views-new/SorobanContractsView.svelte',
	},
	[EntityType.SorobanContractStorageEntry]: {
		detail: '$/views-new/SorobanContractStorageEntryView.svelte',
		list: '$/views-new/SorobanContractStorageEntrysView.svelte',
	},
	[EntityType.SorobanContractStorageEntry_Timestamp]: {
		detail: '$/views-new/SorobanContractStorageEntry_TimestampView.svelte',
		list: '$/views-new/SorobanContractStorageEntry_TimestampsView.svelte',
	},
	[EntityType.SorobanContract_Timestamp]: {
		detail: '$/views-new/SorobanContract_TimestampView.svelte',
		list: '$/views-new/SorobanContract_TimestampsView.svelte',
	},
	[EntityType.SorobanWasm]: {
		detail: '$/views-new/SorobanWasmView.svelte',
	},
	[EntityType.SorobanWasm_Timestamp]: {
		detail: '$/views-new/SorobanWasm_TimestampView.svelte',
		list: '$/views-new/SorobanWasm_TimestampsView.svelte',
	},
	[EntityType.SpecificationProposal]: {
		detail: '$/views-new/SpecificationProposalView.svelte',
		list: '$/views-new/SpecificationProposalsView.svelte',
	},
	[EntityType.SpecificationProposalKind]: {
		detail: '$/views-new/SpecificationProposalKindView.svelte',
		list: '$/views-new/SpecificationProposalKindsView.svelte',
	},
	[EntityType.SpecificationRealm]: {
		detail: '$/views-new/SpecificationRealmView.svelte',
		list: '$/views-new/SpecificationRealmsView.svelte',
	},
	[EntityType.StarknetAccount_Timestamp]: {
		detail: '$/views-new/StarknetAccount_TimestampView.svelte',
		list: '$/views-new/StarknetAccount_TimestampsView.svelte',
	},
	[EntityType.StarknetBlock]: {
		detail: '$/views-new/StarknetBlockView.svelte',
		list: '$/views-new/StarknetBlocksView.svelte',
	},
	[EntityType.StarknetClass]: {
		detail: '$/views-new/StarknetClassView.svelte',
		list: '$/views-new/StarknetClasssView.svelte',
	},
	[EntityType.StarknetContract]: {
		detail: '$/views-new/StarknetContractView.svelte',
		list: '$/views-new/StarknetContractsView.svelte',
	},
	[EntityType.StarknetEvent]: {
		detail: '$/views-new/StarknetEventView.svelte',
		list: '$/views-new/StarknetEventsView.svelte',
	},
	[EntityType.StarknetNetwork]: {
		detail: '$/views-new/StarknetNetworkView.svelte',
	},
	[EntityType.StarknetNetwork_Timestamp]: {
		detail: '$/views-new/StarknetNetwork_TimestampView.svelte',
		list: '$/views-new/StarknetNetwork_TimestampsView.svelte',
	},
	[EntityType.StarknetStorageEntry]: {
		detail: '$/views-new/StarknetStorageEntryView.svelte',
		list: '$/views-new/StarknetStorageEntrysView.svelte',
	},
	[EntityType.StarknetStorageEntry_Timestamp]: {
		detail: '$/views-new/StarknetStorageEntry_TimestampView.svelte',
		list: '$/views-new/StarknetStorageEntry_TimestampsView.svelte',
	},
	[EntityType.StarknetTransaction]: {
		detail: '$/views-new/StarknetTransactionView.svelte',
		list: '$/views-new/StarknetTransactionsView.svelte',
	},
	[EntityType.StarknetTransaction_Timestamp]: {
		detail: '$/views-new/StarknetTransaction_TimestampView.svelte',
		list: '$/views-new/StarknetTransaction_TimestampsView.svelte',
	},
	[EntityType.StellarAccount]: {
		detail: '$/views-new/StellarAccountView.svelte',
		list: '$/views-new/StellarAccountsView.svelte',
	},
	[EntityType.StellarAccountSigner]: {
		detail: '$/views-new/StellarAccountSignerView.svelte',
		list: '$/views-new/StellarAccountSignersView.svelte',
	},
	[EntityType.StellarAccountSigner_Timestamp]: {
		detail: '$/views-new/StellarAccountSigner_TimestampView.svelte',
		list: '$/views-new/StellarAccountSigner_TimestampsView.svelte',
	},
	[EntityType.StellarAccount_Timestamp]: {
		detail: '$/views-new/StellarAccount_TimestampView.svelte',
		list: '$/views-new/StellarAccount_TimestampsView.svelte',
	},
	[EntityType.StellarAsset]: {
		detail: '$/views-new/StellarAssetView.svelte',
		list: '$/views-new/StellarAssetsView.svelte',
	},
	[EntityType.StellarClaimableBalance]: {
		detail: '$/views-new/StellarClaimableBalanceView.svelte',
		list: '$/views-new/StellarClaimableBalancesView.svelte',
	},
	[EntityType.StellarClaimableBalance_Timestamp]: {
		detail: '$/views-new/StellarClaimableBalance_TimestampView.svelte',
		list: '$/views-new/StellarClaimableBalance_TimestampsView.svelte',
	},
	[EntityType.StellarLedger]: {
		detail: '$/views-new/StellarLedgerView.svelte',
		list: '$/views-new/StellarLedgersView.svelte',
	},
	[EntityType.StellarLiquidityPool]: {
		detail: '$/views-new/StellarLiquidityPoolView.svelte',
		list: '$/views-new/StellarLiquidityPoolsView.svelte',
	},
	[EntityType.StellarLiquidityPool_Timestamp]: {
		detail: '$/views-new/StellarLiquidityPool_TimestampView.svelte',
		list: '$/views-new/StellarLiquidityPool_TimestampsView.svelte',
	},
	[EntityType.StellarNetwork]: {
		detail: '$/views-new/StellarNetworkView.svelte',
	},
	[EntityType.StellarNetwork_Timestamp]: {
		detail: '$/views-new/StellarNetwork_TimestampView.svelte',
		list: '$/views-new/StellarNetwork_TimestampsView.svelte',
	},
	[EntityType.StellarOffer]: {
		detail: '$/views-new/StellarOfferView.svelte',
		list: '$/views-new/StellarOffersView.svelte',
	},
	[EntityType.StellarOffer_Timestamp]: {
		detail: '$/views-new/StellarOffer_TimestampView.svelte',
		list: '$/views-new/StellarOffer_TimestampsView.svelte',
	},
	[EntityType.StellarOperation]: {
		detail: '$/views-new/StellarOperationView.svelte',
		list: '$/views-new/StellarOperationsView.svelte',
	},
	[EntityType.StellarTrade]: {
		detail: '$/views-new/StellarTradeView.svelte',
		list: '$/views-new/StellarTradesView.svelte',
	},
	[EntityType.StellarTransaction]: {
		detail: '$/views-new/StellarTransactionView.svelte',
		list: '$/views-new/StellarTransactionsView.svelte',
	},
	[EntityType.StellarTransaction_Timestamp]: {
		detail: '$/views-new/StellarTransaction_TimestampView.svelte',
		list: '$/views-new/StellarTransaction_TimestampsView.svelte',
	},
	[EntityType.StellarTrustline]: {
		detail: '$/views-new/StellarTrustlineView.svelte',
		list: '$/views-new/StellarTrustlinesView.svelte',
	},
	[EntityType.StellarTrustline_Timestamp]: {
		detail: '$/views-new/StellarTrustline_TimestampView.svelte',
		list: '$/views-new/StellarTrustline_TimestampsView.svelte',
	},
	[EntityType.SuiAccount]: {
		detail: '$/views-new/SuiAccountView.svelte',
		list: '$/views-new/SuiAccountsView.svelte',
	},
	[EntityType.SuiBalanceChange]: {
		detail: '$/views-new/SuiBalanceChangeView.svelte',
		list: '$/views-new/SuiBalanceChangesView.svelte',
	},
	[EntityType.SuiCheckpoint]: {
		detail: '$/views-new/SuiCheckpointView.svelte',
		list: '$/views-new/SuiCheckpointsView.svelte',
	},
	[EntityType.SuiCoinBalance_Timestamp]: {
		detail: '$/views-new/SuiCoinBalance_TimestampView.svelte',
		list: '$/views-new/SuiCoinBalance_TimestampsView.svelte',
	},
	[EntityType.SuiCoinType]: {
		detail: '$/views-new/SuiCoinTypeView.svelte',
		list: '$/views-new/SuiCoinTypesView.svelte',
	},
	[EntityType.SuiDynamicFieldEdge]: {
		detail: '$/views-new/SuiDynamicFieldEdgeView.svelte',
		list: '$/views-new/SuiDynamicFieldEdgesView.svelte',
	},
	[EntityType.SuiDynamicFieldEdge_Timestamp]: {
		detail: '$/views-new/SuiDynamicFieldEdge_TimestampView.svelte',
		list: '$/views-new/SuiDynamicFieldEdge_TimestampsView.svelte',
	},
	[EntityType.SuiEvent]: {
		detail: '$/views-new/SuiEventView.svelte',
		list: '$/views-new/SuiEventsView.svelte',
	},
	[EntityType.SuiNetwork]: {
		detail: '$/views-new/SuiNetworkView.svelte',
	},
	[EntityType.SuiNetwork_Timestamp]: {
		detail: '$/views-new/SuiNetwork_TimestampView.svelte',
		list: '$/views-new/SuiNetwork_TimestampsView.svelte',
	},
	[EntityType.SuiObject]: {
		detail: '$/views-new/SuiObjectView.svelte',
		list: '$/views-new/SuiObjectsView.svelte',
	},
	[EntityType.SuiObjectChange]: {
		detail: '$/views-new/SuiObjectChangeView.svelte',
		list: '$/views-new/SuiObjectChangesView.svelte',
	},
	[EntityType.SuiObjectVersion]: {
		detail: '$/views-new/SuiObjectVersionView.svelte',
		list: '$/views-new/SuiObjectVersionsView.svelte',
	},
	[EntityType.SuiPackage]: {
		detail: '$/views-new/SuiPackageView.svelte',
		list: '$/views-new/SuiPackagesView.svelte',
	},
	[EntityType.SuiPackageUpgrade]: {
		detail: '$/views-new/SuiPackageUpgradeView.svelte',
		list: '$/views-new/SuiPackageUpgradesView.svelte',
	},
	[EntityType.SuiPackageVersion]: {
		detail: '$/views-new/SuiPackageVersionView.svelte',
		list: '$/views-new/SuiPackageVersionsView.svelte',
	},
	[EntityType.SuiProgrammableTransactionCommand]: {
		detail: '$/views-new/SuiProgrammableTransactionCommandView.svelte',
		list: '$/views-new/SuiProgrammableTransactionCommandsView.svelte',
	},
	[EntityType.SuiRegulatedCoinState_Timestamp]: {
		detail: '$/views-new/SuiRegulatedCoinState_TimestampView.svelte',
		list: '$/views-new/SuiRegulatedCoinState_TimestampsView.svelte',
	},
	[EntityType.SuiTransaction]: {
		detail: '$/views-new/SuiTransactionView.svelte',
		list: '$/views-new/SuiTransactionsView.svelte',
	},
	[EntityType.SuiTransaction_Timestamp]: {
		detail: '$/views-new/SuiTransaction_TimestampView.svelte',
		list: '$/views-new/SuiTransaction_TimestampsView.svelte',
	},
	[EntityType.SwapQuote]: {
		detail: '$/views-new/SwapQuoteView.svelte',
	},
	[EntityType.SwapQuoteStep]: {
		detail: '$/views-new/SwapQuoteStepView.svelte',
		list: '$/views-new/SwapQuoteStepsView.svelte',
	},
	[EntityType.SwapQuote_Timestamp]: {
		detail: '$/views-new/SwapQuote_TimestampView.svelte',
	},
	[EntityType.SwarmProtocol]: {
		detail: '$/views-new/SwarmProtocolView.svelte',
	},
	[EntityType.SwarmResource]: {
		detail: '$/views-new/SwarmResourceView.svelte',
		list: '$/views-new/SwarmResourcesView.svelte',
	},
	[EntityType.TezosAccount]: {
		detail: '$/views-new/TezosAccountView.svelte',
		list: '$/views-new/TezosAccountsView.svelte',
	},
	[EntityType.TezosAccount_Timestamp]: {
		detail: '$/views-new/TezosAccount_TimestampView.svelte',
		list: '$/views-new/TezosAccount_TimestampsView.svelte',
	},
	[EntityType.TezosBaker]: {
		detail: '$/views-new/TezosBakerView.svelte',
		list: '$/views-new/TezosBakersView.svelte',
	},
	[EntityType.TezosBaker_Cycle_Timestamp]: {
		detail: '$/views-new/TezosBaker_Cycle_TimestampView.svelte',
		list: '$/views-new/TezosBaker_Cycle_TimestampsView.svelte',
	},
	[EntityType.TezosBaker_Timestamp]: {
		detail: '$/views-new/TezosBaker_TimestampView.svelte',
		list: '$/views-new/TezosBaker_TimestampsView.svelte',
	},
	[EntityType.TezosBakingRight]: {
		detail: '$/views-new/TezosBakingRightView.svelte',
		list: '$/views-new/TezosBakingRightsView.svelte',
	},
	[EntityType.TezosBakingRight_Timestamp]: {
		detail: '$/views-new/TezosBakingRight_TimestampView.svelte',
		list: '$/views-new/TezosBakingRight_TimestampsView.svelte',
	},
	[EntityType.TezosBigMap]: {
		detail: '$/views-new/TezosBigMapView.svelte',
		list: '$/views-new/TezosBigMapsView.svelte',
	},
	[EntityType.TezosBigMapDiff]: {
		detail: '$/views-new/TezosBigMapDiffView.svelte',
		list: '$/views-new/TezosBigMapDiffsView.svelte',
	},
	[EntityType.TezosBigMapKey]: {
		detail: '$/views-new/TezosBigMapKeyView.svelte',
		list: '$/views-new/TezosBigMapKeysView.svelte',
	},
	[EntityType.TezosBigMapKey_Timestamp]: {
		detail: '$/views-new/TezosBigMapKey_TimestampView.svelte',
		list: '$/views-new/TezosBigMapKey_TimestampsView.svelte',
	},
	[EntityType.TezosBigMap_Timestamp]: {
		detail: '$/views-new/TezosBigMap_TimestampView.svelte',
		list: '$/views-new/TezosBigMap_TimestampsView.svelte',
	},
	[EntityType.TezosBlock]: {
		detail: '$/views-new/TezosBlockView.svelte',
		list: '$/views-new/TezosBlocksView.svelte',
	},
	[EntityType.TezosContract]: {
		detail: '$/views-new/TezosContractView.svelte',
		list: '$/views-new/TezosContractsView.svelte',
	},
	[EntityType.TezosContract_Timestamp]: {
		detail: '$/views-new/TezosContract_TimestampView.svelte',
		list: '$/views-new/TezosContract_TimestampsView.svelte',
	},
	[EntityType.TezosCycle]: {
		detail: '$/views-new/TezosCycleView.svelte',
		list: '$/views-new/TezosCyclesView.svelte',
	},
	[EntityType.TezosEntrypoint]: {
		detail: '$/views-new/TezosEntrypointView.svelte',
		list: '$/views-new/TezosEntrypointsView.svelte',
	},
	[EntityType.TezosInternalOperation]: {
		detail: '$/views-new/TezosInternalOperationView.svelte',
		list: '$/views-new/TezosInternalOperationsView.svelte',
	},
	[EntityType.TezosMichelsonScript]: {
		detail: '$/views-new/TezosMichelsonScriptView.svelte',
	},
	[EntityType.TezosNetwork]: {
		detail: '$/views-new/TezosNetworkView.svelte',
	},
	[EntityType.TezosNetwork_Timestamp]: {
		detail: '$/views-new/TezosNetwork_TimestampView.svelte',
		list: '$/views-new/TezosNetwork_TimestampsView.svelte',
	},
	[EntityType.TezosOperation]: {
		detail: '$/views-new/TezosOperationView.svelte',
		list: '$/views-new/TezosOperationsView.svelte',
	},
	[EntityType.TezosOperationGroup]: {
		detail: '$/views-new/TezosOperationGroupView.svelte',
		list: '$/views-new/TezosOperationGroupsView.svelte',
	},
	[EntityType.TezosToken]: {
		detail: '$/views-new/TezosTokenView.svelte',
		list: '$/views-new/TezosTokensView.svelte',
	},
	[EntityType.TezosTokenBalance_Timestamp]: {
		detail: '$/views-new/TezosTokenBalance_TimestampView.svelte',
		list: '$/views-new/TezosTokenBalance_TimestampsView.svelte',
	},
	[EntityType.TezosTokenTransfer]: {
		detail: '$/views-new/TezosTokenTransferView.svelte',
		list: '$/views-new/TezosTokenTransfersView.svelte',
	},
	[EntityType.TezosToken_Timestamp]: {
		detail: '$/views-new/TezosToken_TimestampView.svelte',
		list: '$/views-new/TezosToken_TimestampsView.svelte',
	},
	[EntityType.TokenMetadataDocument]: {
		detail: '$/views-new/TokenMetadataDocumentView.svelte',
		list: '$/views-new/TokenMetadataDocumentsView.svelte',
	},
	[EntityType.TokenProgramExtension_Timestamp]: {
		detail: '$/views-new/TokenProgramExtension_TimestampView.svelte',
	},
	[EntityType.TonAccount]: {
		detail: '$/views-new/TonAccountView.svelte',
		list: '$/views-new/TonAccountsView.svelte',
	},
	[EntityType.TonAccount_Timestamp]: {
		detail: '$/views-new/TonAccount_TimestampView.svelte',
		list: '$/views-new/TonAccount_TimestampsView.svelte',
	},
	[EntityType.TonBlock]: {
		detail: '$/views-new/TonBlockView.svelte',
		list: '$/views-new/TonBlocksView.svelte',
	},
	[EntityType.TonContract]: {
		detail: '$/views-new/TonContractView.svelte',
		list: '$/views-new/TonContractsView.svelte',
	},
	[EntityType.TonContractGetMethod]: {
		detail: '$/views-new/TonContractGetMethodView.svelte',
		list: '$/views-new/TonContractGetMethodsView.svelte',
	},
	[EntityType.TonContractGetMethod_Timestamp]: {
		detail: '$/views-new/TonContractGetMethod_TimestampView.svelte',
		list: '$/views-new/TonContractGetMethod_TimestampsView.svelte',
	},
	[EntityType.TonContract_Timestamp]: {
		detail: '$/views-new/TonContract_TimestampView.svelte',
		list: '$/views-new/TonContract_TimestampsView.svelte',
	},
	[EntityType.TonJetton]: {
		detail: '$/views-new/TonJettonView.svelte',
		list: '$/views-new/TonJettonsView.svelte',
	},
	[EntityType.TonJettonBalance_Timestamp]: {
		detail: '$/views-new/TonJettonBalance_TimestampView.svelte',
		list: '$/views-new/TonJettonBalance_TimestampsView.svelte',
	},
	[EntityType.TonJettonTransfer]: {
		detail: '$/views-new/TonJettonTransferView.svelte',
		list: '$/views-new/TonJettonTransfersView.svelte',
	},
	[EntityType.TonJetton_Timestamp]: {
		detail: '$/views-new/TonJetton_TimestampView.svelte',
		list: '$/views-new/TonJetton_TimestampsView.svelte',
	},
	[EntityType.TonMessage]: {
		detail: '$/views-new/TonMessageView.svelte',
		list: '$/views-new/TonMessagesView.svelte',
	},
	[EntityType.TonNetwork]: {
		detail: '$/views-new/TonNetworkView.svelte',
	},
	[EntityType.TonNetwork_Timestamp]: {
		detail: '$/views-new/TonNetwork_TimestampView.svelte',
		list: '$/views-new/TonNetwork_TimestampsView.svelte',
	},
	[EntityType.TonNftCollection]: {
		detail: '$/views-new/TonNftCollectionView.svelte',
		list: '$/views-new/TonNftCollectionsView.svelte',
	},
	[EntityType.TonNftCollection_Timestamp]: {
		detail: '$/views-new/TonNftCollection_TimestampView.svelte',
		list: '$/views-new/TonNftCollection_TimestampsView.svelte',
	},
	[EntityType.TonNftItem]: {
		detail: '$/views-new/TonNftItemView.svelte',
		list: '$/views-new/TonNftItemsView.svelte',
	},
	[EntityType.TonNftItem_Timestamp]: {
		detail: '$/views-new/TonNftItem_TimestampView.svelte',
		list: '$/views-new/TonNftItem_TimestampsView.svelte',
	},
	[EntityType.TonNftTransfer]: {
		detail: '$/views-new/TonNftTransferView.svelte',
		list: '$/views-new/TonNftTransfersView.svelte',
	},
	[EntityType.TonShard_Timestamp]: {
		detail: '$/views-new/TonShard_TimestampView.svelte',
		list: '$/views-new/TonShard_TimestampsView.svelte',
	},
	[EntityType.TonTrace]: {
		detail: '$/views-new/TonTraceView.svelte',
		list: '$/views-new/TonTracesView.svelte',
	},
	[EntityType.TonTrace_Timestamp]: {
		detail: '$/views-new/TonTrace_TimestampView.svelte',
		list: '$/views-new/TonTrace_TimestampsView.svelte',
	},
	[EntityType.TonTransaction]: {
		detail: '$/views-new/TonTransactionView.svelte',
		list: '$/views-new/TonTransactionsView.svelte',
	},
	[EntityType.TonTransactionPhase]: {
		detail: '$/views-new/TonTransactionPhaseView.svelte',
		list: '$/views-new/TonTransactionPhasesView.svelte',
	},
	[EntityType.TonWorkchain]: {
		detail: '$/views-new/TonWorkchainView.svelte',
		list: '$/views-new/TonWorkchainsView.svelte',
	},
	[EntityType.TransferRestriction]: {
		detail: '$/views-new/TransferRestrictionView.svelte',
		list: '$/views-new/TransferRestrictionsView.svelte',
	},
	[EntityType.TransferRestrictionCheck_Timestamp]: {
		detail: '$/views-new/TransferRestrictionCheck_TimestampView.svelte',
		list: '$/views-new/TransferRestrictionCheck_TimestampsView.svelte',
	},
	[EntityType.TronAccount]: {
		detail: '$/views-new/TronAccountView.svelte',
	},
	[EntityType.TronAccountTokenBalance_Timestamp]: {
		detail: '$/views-new/TronAccountTokenBalance_TimestampView.svelte',
		list: '$/views-new/TronAccountTokenBalance_TimestampsView.svelte',
	},
	[EntityType.TronAccount_Timestamp]: {
		detail: '$/views-new/TronAccount_TimestampView.svelte',
		list: '$/views-new/TronAccount_TimestampsView.svelte',
	},
	[EntityType.TronBlock]: {
		detail: '$/views-new/TronBlockView.svelte',
		list: '$/views-new/TronBlocksView.svelte',
	},
	[EntityType.TronContract]: {
		detail: '$/views-new/TronContractView.svelte',
	},
	[EntityType.TronContract_Timestamp]: {
		detail: '$/views-new/TronContract_TimestampView.svelte',
		list: '$/views-new/TronContract_TimestampsView.svelte',
	},
	[EntityType.TronNetwork]: {
		detail: '$/views-new/TronNetworkView.svelte',
	},
	[EntityType.TronNetwork_Timestamp]: {
		detail: '$/views-new/TronNetwork_TimestampView.svelte',
		list: '$/views-new/TronNetwork_TimestampsView.svelte',
	},
	[EntityType.TronToken]: {
		detail: '$/views-new/TronTokenView.svelte',
		list: '$/views-new/TronTokensView.svelte',
	},
	[EntityType.TronTokenTransfer]: {
		detail: '$/views-new/TronTokenTransferView.svelte',
		list: '$/views-new/TronTokenTransfersView.svelte',
	},
	[EntityType.TronToken_Timestamp]: {
		detail: '$/views-new/TronToken_TimestampView.svelte',
		list: '$/views-new/TronToken_TimestampsView.svelte',
	},
	[EntityType.TronTransaction]: {
		detail: '$/views-new/TronTransactionView.svelte',
		list: '$/views-new/TronTransactionsView.svelte',
	},
	[EntityType.TronTransactionReceipt]: {
		detail: '$/views-new/TronTransactionReceiptView.svelte',
	},
	[EntityType.TronWitness]: {
		detail: '$/views-new/TronWitnessView.svelte',
		list: '$/views-new/TronWitnesssView.svelte',
	},
	[EntityType.TronWitness_Timestamp]: {
		detail: '$/views-new/TronWitness_TimestampView.svelte',
		list: '$/views-new/TronWitness_TimestampsView.svelte',
	},
	[EntityType.TrustedIssuer]: {
		detail: '$/views-new/TrustedIssuerView.svelte',
		list: '$/views-new/TrustedIssuersView.svelte',
	},
	[EntityType.Url]: {
		detail: '$/views-new/UrlView.svelte',
		list: '$/views-new/UrlsView.svelte',
	},
	[EntityType.UrlPreview_Timestamp]: {
		detail: '$/views-new/UrlPreview_TimestampView.svelte',
		list: '$/views-new/UrlPreview_TimestampsView.svelte',
	},
	[EntityType.UsageRight_Timestamp]: {
		detail: '$/views-new/UsageRight_TimestampView.svelte',
		list: '$/views-new/UsageRight_TimestampsView.svelte',
	},
	[EntityType.UtxoAddress]: {
		detail: '$/views-new/UtxoAddressView.svelte',
	},
	[EntityType.UtxoAddress_Timestamp]: {
		detail: '$/views-new/UtxoAddress_TimestampView.svelte',
		list: '$/views-new/UtxoAddress_TimestampsView.svelte',
	},
	[EntityType.UtxoBlock]: {
		detail: '$/views-new/UtxoBlockView.svelte',
		list: '$/views-new/UtxoBlocksView.svelte',
	},
	[EntityType.UtxoInput]: {
		detail: '$/views-new/UtxoInputView.svelte',
		list: '$/views-new/UtxoInputsView.svelte',
	},
	[EntityType.UtxoNetwork]: {
		detail: '$/views-new/UtxoNetworkView.svelte',
	},
	[EntityType.UtxoNetwork_Timestamp]: {
		detail: '$/views-new/UtxoNetwork_TimestampView.svelte',
		list: '$/views-new/UtxoNetwork_TimestampsView.svelte',
	},
	[EntityType.UtxoOutput]: {
		detail: '$/views-new/UtxoOutputView.svelte',
		list: '$/views-new/UtxoOutputsView.svelte',
	},
	[EntityType.UtxoTransaction]: {
		detail: '$/views-new/UtxoTransactionView.svelte',
		list: '$/views-new/UtxoTransactionsView.svelte',
	},
	[EntityType.WalletConnectionMethod]: {
		detail: '$/views-new/WalletConnectionMethodView.svelte',
	},
	[EntityType.XNetwork]: {
		detail: '$/views-new/XNetworkView.svelte',
	},
	[EntityType.XPost]: {
		detail: '$/views-new/XPostView.svelte',
		list: '$/views-new/XPostsView.svelte',
	},
	[EntityType.XPost_Timestamp]: {
		detail: '$/views-new/XPost_TimestampView.svelte',
		list: '$/views-new/XPost_TimestampsView.svelte',
	},
	[EntityType.XUser]: {
		detail: '$/views-new/XUserView.svelte',
		list: '$/views-new/XUsersView.svelte',
	},
	[EntityType.XUser_Timestamp]: {
		detail: '$/views-new/XUser_TimestampView.svelte',
		list: '$/views-new/XUser_TimestampsView.svelte',
	},
	[EntityType.XmtpConversation]: {
		detail: '$/views-new/XmtpConversationView.svelte',
		list: '$/views-new/XmtpConversationsView.svelte',
	},
	[EntityType.XmtpNetwork]: {
		detail: '$/views-new/XmtpNetworkView.svelte',
	},
	[EntityType.XrplAccount]: {
		detail: '$/views-new/XrplAccountView.svelte',
		list: '$/views-new/XrplAccountsView.svelte',
	},
	[EntityType.XrplAccount_Timestamp]: {
		detail: '$/views-new/XrplAccount_TimestampView.svelte',
		list: '$/views-new/XrplAccount_TimestampsView.svelte',
	},
	[EntityType.XrplAmendment]: {
		detail: '$/views-new/XrplAmendmentView.svelte',
		list: '$/views-new/XrplAmendmentsView.svelte',
	},
	[EntityType.XrplAmendment_Timestamp]: {
		detail: '$/views-new/XrplAmendment_TimestampView.svelte',
		list: '$/views-new/XrplAmendment_TimestampsView.svelte',
	},
	[EntityType.XrplAmm]: {
		detail: '$/views-new/XrplAmmView.svelte',
		list: '$/views-new/XrplAmmsView.svelte',
	},
	[EntityType.XrplAmm_Timestamp]: {
		detail: '$/views-new/XrplAmm_TimestampView.svelte',
		list: '$/views-new/XrplAmm_TimestampsView.svelte',
	},
	[EntityType.XrplLedger]: {
		detail: '$/views-new/XrplLedgerView.svelte',
		list: '$/views-new/XrplLedgersView.svelte',
	},
	[EntityType.XrplLedgerEntry]: {
		detail: '$/views-new/XrplLedgerEntryView.svelte',
		list: '$/views-new/XrplLedgerEntrysView.svelte',
	},
	[EntityType.XrplNetwork]: {
		detail: '$/views-new/XrplNetworkView.svelte',
	},
	[EntityType.XrplNetwork_Timestamp]: {
		detail: '$/views-new/XrplNetwork_TimestampView.svelte',
		list: '$/views-new/XrplNetwork_TimestampsView.svelte',
	},
	[EntityType.XrplTransaction]: {
		detail: '$/views-new/XrplTransactionView.svelte',
		list: '$/views-new/XrplTransactionsView.svelte',
	},
	[EntityType.XrplTransaction_Timestamp]: {
		detail: '$/views-new/XrplTransaction_TimestampView.svelte',
		list: '$/views-new/XrplTransaction_TimestampsView.svelte',
	},
	[EntityType.XrplTrustline]: {
		detail: '$/views-new/XrplTrustlineView.svelte',
		list: '$/views-new/XrplTrustlinesView.svelte',
	},
	[EntityType.XrplTrustline_Timestamp]: {
		detail: '$/views-new/XrplTrustline_TimestampView.svelte',
		list: '$/views-new/XrplTrustline_TimestampsView.svelte',
	},
	[EntityType.YouTubeChannel]: {
		detail: '$/views-new/YouTubeChannelView.svelte',
		list: '$/views-new/YouTubeChannelsView.svelte',
	},
	[EntityType.YouTubeChannel_Timestamp]: {
		detail: '$/views-new/YouTubeChannel_TimestampView.svelte',
		list: '$/views-new/YouTubeChannel_TimestampsView.svelte',
	},
	[EntityType.YouTubeComment]: {
		detail: '$/views-new/YouTubeCommentView.svelte',
		list: '$/views-new/YouTubeCommentsView.svelte',
	},
	[EntityType.YouTubeComment_Timestamp]: {
		detail: '$/views-new/YouTubeComment_TimestampView.svelte',
		list: '$/views-new/YouTubeComment_TimestampsView.svelte',
	},
	[EntityType.YouTubeNetwork]: {
		detail: '$/views-new/YouTubeNetworkView.svelte',
	},
	[EntityType.YouTubePlaylist]: {
		detail: '$/views-new/YouTubePlaylistView.svelte',
		list: '$/views-new/YouTubePlaylistsView.svelte',
	},
	[EntityType.YouTubePlaylist_Timestamp]: {
		detail: '$/views-new/YouTubePlaylist_TimestampView.svelte',
		list: '$/views-new/YouTubePlaylist_TimestampsView.svelte',
	},
	[EntityType.YouTubeVideo]: {
		detail: '$/views-new/YouTubeVideoView.svelte',
		list: '$/views-new/YouTubeVideosView.svelte',
	},
	[EntityType.YouTubeVideo_Timestamp]: {
		detail: '$/views-new/YouTubeVideo_TimestampView.svelte',
		list: '$/views-new/YouTubeVideo_TimestampsView.svelte',
	},
	[EntityType.ZcashShieldedAction]: {
		detail: '$/views-new/ZcashShieldedActionView.svelte',
		list: '$/views-new/ZcashShieldedActionsView.svelte',
	},
	[EntityType.ZcashShieldedPool]: {
		detail: '$/views-new/ZcashShieldedPoolView.svelte',
	},
	[EntityType.ZcashShieldedPoolBlockState]: {
		detail: '$/views-new/ZcashShieldedPoolBlockStateView.svelte',
	},
	[EntityType.ZeroGConsensusNetwork]: {
		detail: '$/views-new/ZeroGConsensusNetworkView.svelte',
	},
	[EntityType.ZeroGConsensusNetwork_Timestamp]: {
		detail: '$/views-new/ZeroGConsensusNetwork_TimestampView.svelte',
		list: '$/views-new/ZeroGConsensusNetwork_TimestampsView.svelte',
	},
	[EntityType.ZeroGDaNode]: {
		detail: '$/views-new/ZeroGDaNodeView.svelte',
		list: '$/views-new/ZeroGDaNodesView.svelte',
	},
	[EntityType.ZeroGDaQuorum]: {
		detail: '$/views-new/ZeroGDaQuorumView.svelte',
		list: '$/views-new/ZeroGDaQuorumsView.svelte',
	},
	[EntityType.ZeroGDataBlob]: {
		detail: '$/views-new/ZeroGDataBlobView.svelte',
		list: '$/views-new/ZeroGDataBlobsView.svelte',
	},
	[EntityType.ZeroGDataChunk]: {
		detail: '$/views-new/ZeroGDataChunkView.svelte',
		list: '$/views-new/ZeroGDataChunksView.svelte',
	},
	[EntityType.ZeroGKvEntry]: {
		detail: '$/views-new/ZeroGKvEntryView.svelte',
	},
	[EntityType.ZeroGNetwork]: {
		detail: '$/views-new/ZeroGNetworkView.svelte',
	},
	[EntityType.ZeroGNetwork_Timestamp]: {
		detail: '$/views-new/ZeroGNetwork_TimestampView.svelte',
		list: '$/views-new/ZeroGNetwork_TimestampsView.svelte',
	},
	[EntityType.ZeroGServiceProvider]: {
		detail: '$/views-new/ZeroGServiceProviderView.svelte',
	},
	[EntityType.ZeroGServiceRequest]: {
		detail: '$/views-new/ZeroGServiceRequestView.svelte',
		list: '$/views-new/ZeroGServiceRequestsView.svelte',
	},
	[EntityType.ZeroGSettlementTrace]: {
		detail: '$/views-new/ZeroGSettlementTraceView.svelte',
	},
	[EntityType.ZeroGStorageLogEntry]: {
		detail: '$/views-new/ZeroGStorageLogEntryView.svelte',
	},
	[EntityType.ZeroGStorageNode]: {
		detail: '$/views-new/ZeroGStorageNodeView.svelte',
		list: '$/views-new/ZeroGStorageNodesView.svelte',
	},
	[EntityType.ZeroGStorageNode_Timestamp]: {
		detail: '$/views-new/ZeroGStorageNode_TimestampView.svelte',
		list: '$/views-new/ZeroGStorageNode_TimestampsView.svelte',
	},
	[EntityType.ZeroGStorageProof]: {
		detail: '$/views-new/ZeroGStorageProofView.svelte',
		list: '$/views-new/ZeroGStorageProofsView.svelte',
	},
	[EntityType._Global]: {
		detail: '$/views-new/_GlobalView.svelte',
	},
	[EntityType._GlobalActivityPubNetwork]: {
		detail: '$/views-new/_GlobalActivityPubNetworkView.svelte',
	},
	[EntityType._GlobalActivityPubNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalActivityPubNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalActivityPubNetwork_TimestampsView.svelte',
	},
	[EntityType._GlobalAgentNetwork]: {
		detail: '$/views-new/_GlobalAgentNetworkView.svelte',
		list: '$/views-new/_GlobalAgentNetworksView.svelte',
	},
	[EntityType._GlobalAgentNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalAgentNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalAgentNetwork_TimestampsView.svelte',
	},
	[EntityType._GlobalAiArtifactCatalog]: {
		detail: '$/views-new/_GlobalAiArtifactCatalogView.svelte',
		list: '$/views-new/_GlobalAiArtifactCatalogsView.svelte',
	},
	[EntityType._GlobalAiArtifactCatalog_Timestamp]: {
		detail: '$/views-new/_GlobalAiArtifactCatalog_TimestampView.svelte',
		list: '$/views-new/_GlobalAiArtifactCatalog_TimestampsView.svelte',
	},
	[EntityType._GlobalAiModelCatalog]: {
		detail: '$/views-new/_GlobalAiModelCatalogView.svelte',
		list: '$/views-new/_GlobalAiModelCatalogsView.svelte',
	},
	[EntityType._GlobalAiModelCatalog_Timestamp]: {
		detail: '$/views-new/_GlobalAiModelCatalog_TimestampView.svelte',
		list: '$/views-new/_GlobalAiModelCatalog_TimestampsView.svelte',
	},
	[EntityType._GlobalArweaveNetwork]: {
		detail: '$/views-new/_GlobalArweaveNetworkView.svelte',
	},
	[EntityType._GlobalArweaveNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalArweaveNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalArweaveNetwork_TimestampsView.svelte',
	},
	[EntityType._GlobalAtprotoNetwork]: {
		detail: '$/views-new/_GlobalAtprotoNetworkView.svelte',
	},
	[EntityType._GlobalAtprotoNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalAtprotoNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalAtprotoNetwork_TimestampsView.svelte',
	},
	[EntityType._GlobalEnsNetwork]: {
		detail: '$/views-new/_GlobalEnsNetworkView.svelte',
	},
	[EntityType._GlobalEnsNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalEnsNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalEnsNetwork_TimestampsView.svelte',
	},
	[EntityType._GlobalEvmAbiCatalog]: {
		detail: '$/views-new/_GlobalEvmAbiCatalogView.svelte',
	},
	[EntityType._GlobalEvmAbiCatalog_Timestamp]: {
		detail: '$/views-new/_GlobalEvmAbiCatalog_TimestampView.svelte',
		list: '$/views-new/_GlobalEvmAbiCatalog_TimestampsView.svelte',
	},
	[EntityType._GlobalFarcasterNetwork]: {
		detail: '$/views-new/_GlobalFarcasterNetworkView.svelte',
	},
	[EntityType._GlobalFarcasterNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalFarcasterNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalFarcasterNetwork_TimestampsView.svelte',
	},
	[EntityType._GlobalIpfsAccess]: {
		detail: '$/views-new/_GlobalIpfsAccessView.svelte',
	},
	[EntityType._GlobalIpfsAccess_Timestamp]: {
		detail: '$/views-new/_GlobalIpfsAccess_TimestampView.svelte',
		list: '$/views-new/_GlobalIpfsAccess_TimestampsView.svelte',
	},
	[EntityType._GlobalLensNetwork]: {
		detail: '$/views-new/_GlobalLensNetworkView.svelte',
	},
	[EntityType._GlobalLensNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalLensNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalLensNetwork_TimestampsView.svelte',
	},
	[EntityType._GlobalNostrNetwork]: {
		detail: '$/views-new/_GlobalNostrNetworkView.svelte',
	},
	[EntityType._GlobalNostrNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalNostrNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalNostrNetwork_TimestampsView.svelte',
	},
	[EntityType._GlobalRedditNetwork]: {
		detail: '$/views-new/_GlobalRedditNetworkView.svelte',
	},
	[EntityType._GlobalRedditNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalRedditNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalRedditNetwork_TimestampsView.svelte',
	},
	[EntityType._GlobalRssNetwork]: {
		detail: '$/views-new/_GlobalRssNetworkView.svelte',
	},
	[EntityType._GlobalRssNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalRssNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalRssNetwork_TimestampsView.svelte',
	},
	[EntityType._GlobalSwarmAccess]: {
		detail: '$/views-new/_GlobalSwarmAccessView.svelte',
	},
	[EntityType._GlobalSwarmAccess_Timestamp]: {
		detail: '$/views-new/_GlobalSwarmAccess_TimestampView.svelte',
		list: '$/views-new/_GlobalSwarmAccess_TimestampsView.svelte',
	},
	[EntityType._GlobalXNetwork]: {
		detail: '$/views-new/_GlobalXNetworkView.svelte',
	},
	[EntityType._GlobalXNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalXNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalXNetwork_TimestampsView.svelte',
	},
	[EntityType._GlobalYouTubeNetwork]: {
		detail: '$/views-new/_GlobalYouTubeNetworkView.svelte',
	},
	[EntityType._GlobalYouTubeNetwork_Timestamp]: {
		detail: '$/views-new/_GlobalYouTubeNetwork_TimestampView.svelte',
		list: '$/views-new/_GlobalYouTubeNetwork_TimestampsView.svelte',
	},
} as const satisfies Partial<Record<EntityType, {
	detail?: ViewComponentPath
	list?: ViewComponentPath
	timestamp?: ViewComponentPath
}>>

export const routeEntityHubPlacements = [
	{
		id: 'social-activitypub',
		prefixes: [
			'ActivityPub',
			'_GlobalActivityPub',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'social',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'activitypub',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'activitypub',
			},
		],
	},
	{
		id: 'social-atproto',
		prefixes: [
			'Atproto',
			'_GlobalAtproto',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'social',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'atproto',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'atproto',
			},
		],
	},
	{
		id: 'social-farcaster',
		prefixes: [
			'Farcaster',
			'_GlobalFarcaster',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'social',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'farcaster',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'farcaster',
			},
		],
	},
	{
		id: 'social-lens',
		prefixes: [
			'Lens',
			'_GlobalLens',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'social',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'lens',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'lens',
			},
		],
	},
	{
		id: 'social-nostr',
		prefixes: [
			'Nostr',
			'_GlobalNostr',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'social',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'nostr',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'nostr',
			},
		],
	},
	{
		id: 'social-reddit',
		prefixes: [
			'Reddit',
			'_GlobalReddit',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'social',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'reddit',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'reddit',
			},
		],
	},
	{
		id: 'social-rss',
		prefixes: [
			'Rss',
			'_GlobalRss',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'social',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'rss',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'rss',
			},
		],
	},
	{
		id: 'social-x',
		prefixes: [
			'XPost',
			'XUser',
			'XNetwork',
			'_GlobalX',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'social',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'x',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'x',
			},
		],
	},
	{
		id: 'social-xmtp',
		prefixes: [
			'Xmtp',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'social',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'xmtp',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'xmtp',
			},
		],
	},
	{
		id: 'social-youtube',
		prefixes: [
			'YouTube',
			'_GlobalYouTube',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'social',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'youtube',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'youtube',
			},
		],
	},
	{
		id: 'assets',
		prefixes: [
			'Asset',
			'Bridge',
			'Cashu',
			'Cctp',
			'ClaimTopic',
			'Coin',
			'Currency',
			'Elements',
			'Leverage',
			'Liquidity',
			'Market',
			'Nft',
			'Oracle',
			'Payout',
			'RegulatedAsset',
			'Royalty',
			'ScalingDeployment',
			'Swap',
			'Token',
			'TransferRestriction',
			'Usage',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'assets',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'assets',
			},
		],
	},
	{
		id: 'services',
		prefixes: [
			'A2a',
			'Acp',
			'Account',
			'Agent',
			'Ai',
			'Blockhead',
			'Eip8004',
			'Mcp',
			'Move',
			'Payjoin',
			'Wallet',
			'_GlobalAgent',
			'_GlobalAi',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'explore',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'services',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'services',
			},
		],
	},
	{
		id: 'data-protocols',
		prefixes: [
			'Arweave',
			'BitTorrent',
			'Codex',
			'Git',
			'Ipfs',
			'Magnet',
			'Media',
			'Radicle',
			'Swarm',
			'Url',
			'_GlobalArweave',
			'_GlobalIpfs',
			'_GlobalSwarm',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'explore',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'data',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'data',
			},
		],
	},
	{
		id: 'evm',
		prefixes: [
			'Eas',
			'EigenLayer',
			'Ens',
			'Erc',
			'Ethereum',
			'Evm',
			'Mev',
			'_GlobalEns',
			'_GlobalEvm',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'explore',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'evm',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'evm',
			},
		],
	},
	{
		id: 'networks',
		prefixes: [
			'Algorand',
			'Aptos',
			'Avail',
			'Avalanche',
			'Beacon',
			'Bitcoin',
			'Bittensor',
			'Bnb',
			'Cardano',
			'Celestia',
			'Cosmos',
			'Dydx',
			'Fedimint',
			'Filecoin',
			'Hedera',
			'Hyperliquid',
			'Ibc',
			'Icp',
			'Kaspa',
			'Lightning',
			'Litecoin',
			'Logos',
			'Monero',
			'Near',
			'Network',
			'Polkadot',
			'Pyth',
			'Quilibrium',
			'Solana',
			'Soroban',
			'Starknet',
			'Stellar',
			'Sui',
			'Tezos',
			'Ton',
			'Tron',
			'Utxo',
			'Xrpl',
			'Zcash',
			'ZeroG',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'explore',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'networks',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'networks',
			},
		],
	},
	{
		id: 'governance',
		prefixes: [
			'Compliance',
			'ContractInterface',
			'Issuer',
			'Specification',
			'Trusted',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'explore',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'governance',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'governance',
			},
		],
	},
	{
		id: 'global',
		prefixes: [
			'_Global',
		],
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'explore',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'global',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'global',
			},
		],
	},
] as const

export const routeEntityFields = {
	GlobalExplore: [
		'$$networks',
		'$$networkUpgrades',
		'$$proposals',
	],
	GlobalNetworks: [
		'$$networks',
		'$$evmNetworks',
	],
	GlobalAssets: [
		'$$coins',
		'$$markets',
		'$$currencies',
		'$$liquidityPools',
		'$$liquidityPositions',
	],
	EvmNetworkSummary: [
		'caip2',
		'name',
		'namespace',
		'shortName',
		'$$rpcUrls',
		'$$blockExplorerUrls',
		'$$upgrades',
	],
	EvmNetworkBlocks: [
		'caip2',
		'name',
	],
	EvmNetworkTransactions: [
		'caip2',
		'name',
	],
} as const satisfies {
	GlobalExplore: readonly EntityFieldName<typeof schema, EntityType._Global>[]
	GlobalNetworks: readonly EntityFieldName<typeof schema, EntityType._Global>[]
	GlobalAssets: readonly EntityFieldName<typeof schema, EntityType._Global>[]
	EvmNetworkSummary: readonly EntityFieldName<typeof schema, EntityType.EvmNetwork>[]
	EvmNetworkBlocks: readonly EntityFieldName<typeof schema, EntityType.EvmNetwork>[]
	EvmNetworkTransactions: readonly EntityFieldName<typeof schema, EntityType.EvmNetwork>[]
}

export const routeParams = [
	{
		name: 'caip2',
		matcher: 'eip155NetworkCaip2',
		fixture: 'eip155:1',
		entityField: 'EvmNetwork.caip2',
		description: 'EIP-155 network in CAIP-2 namespace/reference form.',
	},
	{
		name: 'networkSlug',
		matcher: 'networkSlug',
		fixture: 'bitcoin',
		entityField: 'Network.slug',
		description: 'Catalog network slug used by non-EVM and legacy network pages.',
	},
	{
		name: 'address',
		matcher: 'evmAddress',
		fixture: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
		entityField: 'EvmAccount.address',
	},
	{
		name: 'blockNumber',
		matcher: 'evmBlockNumber',
		fixture: '18000000',
		entityField: 'EvmBlock.blockNumber',
	},
	{
		name: 'transactionId',
		matcher: 'evmTxHash',
		fixture: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
		entityField: 'EvmTransaction.hash',
	},
	{
		name: 'logIndex',
		matcher: 'nonNegativeInteger',
		fixture: '0',
		entityField: 'EvmLog.logIndex',
	},
	{
		name: 'blobIndex',
		matcher: 'nonNegativeInteger',
		fixture: '0',
		entityField: 'EvmBlob.blobIndex',
	},
	{
		name: 'coinId',
		fixture: 'ETH',
		entityField: 'Coin.id',
	},
	{
		name: 'marketKey',
		fixture: '[devalue Market selector]',
		entityField: 'Market selector',
		description: 'Serialized selector payload; generated scripts should own exact devalue encoding.',
	},
	{
		name: 'marketVenueId',
		matcher: 'marketVenueId',
		fixture: 'binance',
		entityField: 'Market.marketVenue',
		description: 'Market venue is the leading market route context.',
	},
	{
		name: 'baseCoinId',
		fixture: 'ETH',
		entityField: 'Market.base',
	},
	{
		name: 'quoteCoinId',
		fixture: 'USD',
		entityField: 'Market.quote',
	},
	{
		name: 'marketKind',
		fixture: 'spot',
		entityField: 'Market.marketKind',
	},
	{
		name: 'timestampMs',
		matcher: 'nonNegativeInteger',
		fixture: '1700000000000',
		description: 'Observation timestamp in milliseconds.',
	},
	{
		name: 'feedKey',
		fixture: 'default',
		description: 'Optional source/feed partition for market observations.',
	},
	{
		name: 'timeInterval',
		fixture: '1d',
		entityField: 'Market_TimeInterval_Timestamp.timeInterval',
	},
	{
		name: 'chainId',
		matcher: 'eip155ChainId',
		fixture: '1',
		entityField: 'EvmNetwork.chainId',
	},
	{
		name: 'poolId',
		fixture: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
		entityField: 'LiquidityPool.id',
	},
	{
		name: 'vaultId',
		fixture: '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8',
		entityField: 'Erc4626Vault.id',
	},
	{
		name: 'ensName',
		fixture: 'vitalik.eth',
		entityField: 'EnsName.name',
	},
	{
		name: 'specificationRealmSlug',
		matcher: 'specificationRealmSlug',
		fixture: 'ethereum',
		entityField: 'SpecificationProposal.realm',
	},
	{
		name: 'proposalKindSlug',
		matcher: 'proposalKindSlug',
		fixture: 'eip',
		entityField: 'SpecificationProposal.kind',
	},
	{
		name: 'proposalRef',
		matcher: 'proposalRef',
		fixture: 'eip-1559',
		entityField: 'SpecificationProposal.ref',
	},
	{
		name: 'contentPath',
		rest: true,
		fixture: 'index.html',
		description: 'Nested gateway/resource path under a content-addressed root.',
	},
	{
		name: 'routeId',
		fixture: '[devalue BridgeRoute selector]',
		entityField: 'BridgeRoute selector',
		description: 'Serialized BridgeRoute selector payload.',
	},
	{
		name: 'stepIndex',
		matcher: 'bridgeRouteStepIndex',
		fixture: '0',
		entityField: 'BridgeRouteStep.index',
	},
	{
		name: 'url',
		fixture: 'https%3A%2F%2Fexample.com',
		entityField: 'Url.url',
		description: 'Percent-encoded URL selector value.',
	},
	{
		name: 'walletId',
		fixture: 'e2e-probe-wallet',
		entityField: 'BlockheadWallet.id',
		description: 'Blockhead wallet id used by the wallet connection selector.',
	},
	{
		name: 'hex',
		fixture: '0xa9059cbb',
		entityField: 'EvmCalldata.hex',
		description: '0x-prefixed calldata hex string.',
	},
	{
		name: 'hash',
		fixture: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
		description: 'Hash selector within an already scoped entity route.',
	},
	{
		name: 'source',
		fixture: 'coingecko',
		description: 'Source/feed partition key.',
	},
	{
		name: 'scope',
		fixture: 'overview',
		description: 'Product sub-scope used by hub/list pages with optional scoped tabs.',
	},
	{
		name: 'accountAddress',
		matcher: 'evmAddress',
		fixture: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
		entityField: 'LensAccount.address',
	},
	{
		name: 'activityStreamsUri',
		fixture: 'https%3A%2F%2Fexample.social%2Fusers%2Falice',
		entityField: 'ActivityPubActor.activityStreamsUri',
	},
	{
		name: 'apiHost',
		fixture: 'iris-api.circle.com',
		entityField: 'CctpAllowance.apiHost',
	},
	{
		name: 'canonicalRemoteUrl',
		fixture: 'https%3A%2F%2Fgithub.com%2Fowner%2Frepo.git',
		entityField: 'GitRepository.canonicalRemoteUrl',
	},
	{
		name: 'channelId',
		fixture: 'general',
		description: 'Channel identifier within the current product family.',
	},
	{
		name: 'coin',
		matcher: 'evmAddress',
		fixture: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		entityField: 'EvmCoinInstance.address',
	},
	{
		name: 'contactId',
		fixture: 'peer-1',
		entityField: 'BlockheadRoomPeer.id',
	},
	{
		name: 'conversationId',
		fixture: 'conversation-1',
		entityField: 'BlockheadAgentConversation.id',
	},
	{
		name: 'createdAt',
		fixture: '1700000000000',
		description: 'Creation timestamp or stable created-at selector component.',
	},
	{
		name: 'did',
		fixture: 'did:plc:ewvi7nxzyoun6zhxrhs64oiz',
		entityField: 'AtprotoActor.did',
	},
	{
		name: 'eventId',
		fixture: 'note1event',
		description: 'Event id inside event-based social protocols.',
	},
	{
		name: 'fid',
		matcher: 'farcasterFid',
		fixture: '1',
		entityField: 'FarcasterUser.fid',
	},
	{
		name: 'fname',
		fixture: 'alice',
		entityField: 'FarcasterUser.fname',
	},
	{
		name: 'handle',
		fixture: 'alice.bsky.social',
		entityField: 'AtprotoActor.handle',
	},
	{
		name: 'instanceOrigin',
		fixture: 'https%3A%2F%2Fexample.social',
		entityField: 'ActivityPubActor.instanceOrigin',
	},
	{
		name: 'iso4217',
		matcher: 'iso4217',
		fixture: 'USD',
		entityField: 'Currency.iso4217',
	},
	{
		name: 'itemId',
		fixture: 'item-1',
		entityField: 'RssItem.id',
	},
	{
		name: 'keysetId',
		fixture: 'keyset-1',
		entityField: 'CashuKeyset.id',
	},
	{
		name: 'linkId',
		fixture: 't3_abc123',
		entityField: 'RedditLink.id',
	},
	{
		name: 'localAccountId',
		fixture: 'alice',
		entityField: 'ActivityPubActor.localAccountId',
	},
	{
		name: 'localStatusId',
		fixture: '109000000000000000',
		entityField: 'ActivityPubNote.localStatusId',
	},
	{
		name: 'messageId',
		fixture: 'message-1',
		entityField: 'CctpMessage.id',
	},
	{
		name: 'mintUrl',
		fixture: 'https%3A%2F%2Fmint.example',
		entityField: 'CashuMint.url',
	},
	{
		name: 'namespace',
		fixture: 'ipfs',
		description: 'Content-addressing namespace.',
	},
	{
		name: 'objectFormat',
		fixture: 'sha1',
		entityField: 'GitObject.objectFormat',
	},
	{
		name: 'objectId',
		fixture: 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391',
		entityField: 'GitObject.objectId',
	},
	{
		name: 'owner',
		matcher: 'evmAddress',
		fixture: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
		entityField: 'EvmNetworkAccount.address',
	},
	{
		name: 'path',
		fixture: 'README.md',
		description: 'Path selector inside a repository tree or resource.',
	},
	{
		name: 'playlistId',
		fixture: 'PL123',
		entityField: 'YouTubePlaylist.playlistId',
	},
	{
		name: 'positionId',
		fixture: 'position-1',
		entityField: 'LiquidityPosition.id',
	},
	{
		name: 'postId',
		fixture: 'post-1',
		description: 'Post id within the current social protocol.',
	},
	{
		name: 'pubkey',
		fixture: 'npub1example',
		entityField: 'NostrProfile.pubkey',
	},
	{
		name: 'quoteId',
		fixture: 'quote-1',
		entityField: 'SwapQuote.id',
	},
	{
		name: 'refName',
		fixture: 'refs%2Fheads%2Fmain',
		entityField: 'GitRef.refName',
	},
	{
		name: 'reference',
		fixture: 'bzz-reference',
		entityField: 'SwarmResource.reference',
	},
	{
		name: 'relayUrl',
		fixture: 'wss%3A%2F%2Frelay.example',
		entityField: 'NostrRelay.url',
	},
	{
		name: 'repositoryId',
		fixture: 'repo-1',
		entityField: 'GitRepository.repositoryId',
	},
	{
		name: 'roomId',
		fixture: 'room-1',
		entityField: 'BlockheadRoom.id',
	},
	{
		name: 'sessionId',
		fixture: 'session-1',
		entityField: 'BlockheadSession.id',
	},
	{
		name: 'sourceId',
		fixture: 'source-1',
		entityField: 'BlockheadSource.id',
	},
	{
		name: 'sourceTxHash',
		fixture: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
		description: 'Source-chain transaction hash.',
	},
	{
		name: 'spender',
		matcher: 'evmAddress',
		fixture: '0x000000000022d473030f116ddee9f6b43ac78ba3',
		entityField: 'EvmActorCoinAllowance.spender',
	},
	{
		name: 'subreddit',
		fixture: 'ethereum',
		entityField: 'RedditSubreddit.name',
	},
	{
		name: 'target',
		fixture: 'bafybeigdyrzt',
		description: 'Content-addressed target.',
	},
	{
		name: 'transferId',
		fixture: 'transfer-1',
		entityField: 'BridgeTransfer.id',
	},
	{
		name: 'upgradeSlug',
		fixture: 'london',
		entityField: 'EthereumNetworkUpgrade.slug',
	},
	{
		name: 'uri',
		rest: true,
		fixture: 'at:%2F%2Fdid:plc:ewvi7nxzyoun6zhxrhs64oiz%2Fapp.bsky.feed.post%2F3jucagnrmn22k',
		entityField: 'AtprotoPost.uri',
	},
	{
		name: 'userId',
		matcher: 'farcasterFid',
		fixture: '1',
		entityField: 'FarcasterUser.fid',
	},
	{
		name: 'videoId',
		fixture: 'dQw4w9WgXcQ',
		entityField: 'YouTubeVideo.videoId',
	},
] as const satisfies RouteParam[]

export const routeFileTemplates = {
	entityPage: {
		kind: RouteComponentKind.Page,
		children: [
			{
				kind: RouteComponentKind.EntityView,
			},
		],
	},
	parentEntityLayout: {
		kind: RouteComponentKind.ParentPageCollapsible,
	},
	resourceBoundaryEntityPage: {
		kind: RouteComponentKind.Page,
		children: [
			{
				kind: RouteComponentKind.ResourceBoundary,
				children: [
					{
						kind: RouteComponentKind.EntityView,
					},
				],
			},
		],
	},
} as const satisfies Record<string, RouteComponent>

export const routeFiles = [
	{
		id: 'ens-name-parent-layout',
		route: 'ens-name',
		kind: 'layout',
		file: 'src/routes/(explore)/(ens)/ens/name/[ensName]/(ensName)/+layout.svelte',
		segments: [
			{
				kind: RouteSegmentKind.Group,
				value: 'explore',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'ens',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'ens',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'name',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'ensName',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'ensName',
			},
		],
		urlPath: '/ens/name/[ensName]',
		params: [
			routeParams[12],
		],
		component: {
			kind: RouteComponentKind.ParentPageCollapsible,
			props: {
				href: '/(explore)/(ens)/ens/name/[ensName]',
				id: {
					kind: RouteSelectionKind.ParamTransform,
					param: 'ensName',
					transform: 'stringify({ name: value })',
				},
				key: {
					kind: RouteSelectionKind.Param,
					param: 'ensName',
				},
			},
			children: [
				{
					kind: RouteComponentKind.EntityView,
					component: '$/views/EnsView.svelte',
					selection: {
						kind: RouteSelectionKind.EntitySelector,
						entity: EntityType.EnsName,
						selector: {
							name: {
								kind: RouteSelectionKind.Param,
								param: 'ensName',
							},
						},
					},
					props: {
						layout: 'EntityLayout.SummaryInline',
					},
				},
			],
		},
		notes: 'Captures the recurring parent summary layout pattern used by entity subroutes.',
	},
	{
		id: 'bridge-route-page-module',
		route: 'bridge-route',
		kind: 'page-module',
		file: 'src/routes/bridge/route/[routeId]/+page.ts',
		segments: [
			{
				kind: RouteSegmentKind.Static,
				value: 'bridge',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'route',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'routeId',
			},
		],
		urlPath: '/bridge/route/[routeId]',
		load: {
			imports: [
				'error from @sveltejs/kit',
				'parse from devalue',
				'parseEntitySelector from $/schema/$schema.ts',
				'BridgeRouteSchema from $/schema/BridgeRoute.ts',
				'schema from $/schema/index.ts',
			],
			parse: [
				{
					param: 'routeId',
					parser: 'parseEntitySelector(schema, BridgeRouteSchema, parse(decodeURIComponent(value)))',
					errorStatus: 404,
					errorMessage: 'Invalid bridge route',
				},
			],
			returns: {
				selector: {
					kind: RouteSelectionKind.DevalueParam,
					param: 'routeId',
					schemaEntity: EntityType.BridgeRoute,
				},
			},
		},
		notes: 'Route modules need first-class parse/error declarations; a page-only entity binding cannot regenerate this.',
	},
	{
		id: 'bridge-route-page',
		route: 'bridge-route',
		kind: 'page',
		file: 'src/routes/bridge/route/[routeId]/+page.svelte',
		segments: [
			{
				kind: RouteSegmentKind.Static,
				value: 'bridge',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'route',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'routeId',
			},
		],
		urlPath: '/bridge/route/[routeId]',
		params: [
			routeParams[17],
		],
		component: {
			kind: RouteComponentKind.Page,
			children: [
				{
					kind: RouteComponentKind.EntityView,
					component: '$/views/BridgeRouteView.svelte',
					selection: {
						kind: RouteSelectionKind.EntitySelector,
						entity: EntityType.BridgeRoute,
						selector: {
							data: {
								kind: RouteSelectionKind.Param,
								param: 'data.selector',
							},
						},
					},
				},
			],
		},
	},
	{
		id: 'bridge-route-step-page-module',
		route: 'bridge-route-step',
		kind: 'page-module',
		file: 'src/routes/bridge/route/[routeId]/step/[stepIndex=bridgeRouteStepIndex]/+page.ts',
		segments: [
			{
				kind: RouteSegmentKind.Static,
				value: 'bridge',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'route',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'routeId',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'step',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'stepIndex',
				matcher: 'bridgeRouteStepIndex',
			},
		],
		urlPath: '/bridge/route/[routeId]/step/[stepIndex=bridgeRouteStepIndex]',
		params: [
			routeParams[17],
			routeParams[18],
		],
		load: {
			imports: [
				'error from @sveltejs/kit',
				'parse from devalue',
				'parseEntitySelector from $/schema/$schema.ts',
				'BridgeRouteSchema from $/schema/BridgeRoute.ts',
				'BridgeRouteStepSchema from $/schema/BridgeRouteStep.ts',
				'schema from $/schema/index.ts',
			],
			parse: [
				{
					param: 'routeId',
					parser: 'parseEntitySelector(schema, BridgeRouteSchema, parse(decodeURIComponent(value)))',
					errorStatus: 404,
					errorMessage: 'Invalid bridge route',
				},
				{
					param: 'stepIndex',
					parser: 'Number(value)',
					errorStatus: 404,
					errorMessage: 'Invalid bridge step',
				},
			],
			returns: {
				selector: {
					kind: RouteSelectionKind.EntitySelector,
					entity: EntityType.BridgeRouteStep,
					selector: {
						$route: {
							kind: RouteSelectionKind.DevalueParam,
							param: 'routeId',
							schemaEntity: EntityType.BridgeRoute,
						},
						index: {
							kind: RouteSelectionKind.ParamTransform,
							param: 'stepIndex',
							transform: 'Number(value)',
						},
					},
				},
			},
		},
	},
	{
		id: 'bridge-route-step-page',
		route: 'bridge-route-step',
		kind: 'page',
		file: 'src/routes/bridge/route/[routeId]/step/[stepIndex=bridgeRouteStepIndex]/+page.svelte',
		segments: [
			{
				kind: RouteSegmentKind.Static,
				value: 'bridge',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'route',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'routeId',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'step',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'stepIndex',
				matcher: 'bridgeRouteStepIndex',
			},
		],
		urlPath: '/bridge/route/[routeId]/step/[stepIndex=bridgeRouteStepIndex]',
		params: [
			routeParams[17],
			routeParams[18],
		],
		component: {
			kind: RouteComponentKind.Page,
			children: [
				{
					kind: RouteComponentKind.EntityView,
					component: '$/views/BridgeRouteStepView.svelte',
					selection: {
						kind: RouteSelectionKind.EntitySelector,
						entity: EntityType.BridgeRouteStep,
						selector: {
							data: {
								kind: RouteSelectionKind.Param,
								param: 'data.selector',
							},
						},
					},
				},
			],
		},
	},
	{
		id: 'url-page-module',
		route: 'url',
		kind: 'page-module',
		file: 'src/routes/url/[url]/+page.ts',
		segments: [
			{
				kind: RouteSegmentKind.Static,
				value: 'url',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'url',
			},
		],
		urlPath: '/url/[url]',
		load: {
			parse: [
				{
					param: 'url',
					parser: 'parseEntitySelector(schema, UrlSchema, { url: decodeURIComponent(value) })',
					errorStatus: 404,
					errorMessage: 'Invalid URL',
				},
			],
			returns: {
				selector: {
					kind: RouteSelectionKind.EntitySelector,
					entity: EntityType.Url,
					selector: {
						url: {
							kind: RouteSelectionKind.ParamTransform,
							param: 'url',
							transform: 'decodeURIComponent(value)',
						},
					},
				},
			},
		},
	},
	{
		id: 'url-page',
		route: 'url',
		kind: 'page',
		file: 'src/routes/url/[url]/+page.svelte',
		segments: [
			{
				kind: RouteSegmentKind.Static,
				value: 'url',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'url',
			},
		],
		urlPath: '/url/[url]',
		params: [
			routeParams[19],
		],
		component: {
			kind: RouteComponentKind.Page,
			children: [
				{
					kind: RouteComponentKind.EntityView,
					component: '$/views/UrlView.svelte',
					selection: {
						kind: RouteSelectionKind.EntitySelector,
						entity: EntityType.Url,
						selector: {
							data: {
								kind: RouteSelectionKind.Param,
								param: 'data.selector',
							},
						},
					},
				},
			],
		},
	},
	{
		id: 'wallet-connection-page-module',
		route: 'wallet-connection',
		kind: 'page-module',
		file: 'src/routes/~/(accounts)/accounts/connections/[walletId]/+page.ts',
		segments: [
			{
				kind: RouteSegmentKind.Static,
				value: '~',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'accounts',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'accounts',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'connections',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'walletId',
			},
		],
		urlPath: '/~/accounts/connections/[walletId]',
		params: [
			routeParams[20],
		],
		load: {
			imports: [
				'error from @sveltejs/kit',
				'parseEntitySelector from $/schema/$schema.ts',
				'BlockheadWalletConnectionSchema from $/schema/BlockheadWalletConnection.ts',
				'schema from $/schema/index.ts',
			],
			parse: [
				{
					param: 'walletId',
					parser: 'parseEntitySelector(schema, BlockheadWalletConnectionSchema, { $wallet: { id: decodeURIComponent(value) } })',
					errorStatus: 404,
					errorMessage: 'Invalid wallet connection',
				},
			],
			returns: {
				selector: {
					kind: RouteSelectionKind.EntitySelector,
					entity: EntityType.BlockheadWalletConnection,
					selector: {
						$wallet: {
							kind: RouteSelectionKind.EntitySelector,
							entity: EntityType.BlockheadWallet,
							selector: {
								id: {
									kind: RouteSelectionKind.ParamTransform,
									param: 'walletId',
									transform: 'decodeURIComponent(value)',
								},
							},
						},
					},
				},
			},
		},
	},
	{
		id: 'wallet-connection-page',
		route: 'wallet-connection',
		kind: 'page',
		file: 'src/routes/~/(accounts)/accounts/connections/[walletId]/+page.svelte',
		segments: [
			{
				kind: RouteSegmentKind.Static,
				value: '~',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'accounts',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'accounts',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'connections',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'walletId',
			},
		],
		urlPath: '/~/accounts/connections/[walletId]',
		params: [
			routeParams[20],
		],
		component: {
			kind: RouteComponentKind.Page,
			children: [
				{
					kind: RouteComponentKind.EntityView,
					component: '$/views/BlockheadWalletConnectionView.svelte',
					selection: {
						kind: RouteSelectionKind.EntitySelector,
						entity: EntityType.BlockheadWalletConnection,
						selector: {
							data: {
								kind: RouteSelectionKind.Param,
								param: 'data.selector',
							},
						},
					},
				},
			],
		},
	},
	{
		id: 'evm-calldata-detail-page-module',
		route: 'evm-calldata-detail',
		kind: 'page-module',
		file: 'src/routes/(explore)/(evm)/evm/(calldata)/calldata/[hex]/+page.ts',
		segments: [
			{
				kind: RouteSegmentKind.Group,
				value: 'explore',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'evm',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'evm',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'calldata',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'calldata',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'hex',
			},
		],
		urlPath: '/evm/calldata/[hex]',
		params: [
			routeParams[21],
		],
		load: {
			imports: [
				'error from @sveltejs/kit',
				'ZeroExHex from $/schema/ZeroExHex.ts',
			],
			parse: [
				{
					param: 'hex',
					parser: 'ZeroExHex(value)',
					errorStatus: 404,
					errorMessage: 'Invalid calldata hex',
				},
			],
			returns: {
				selector: {
					kind: RouteSelectionKind.EntitySelector,
					entity: EntityType.EvmCalldata,
					selector: {
						hex: {
							kind: RouteSelectionKind.ParamTransform,
							param: 'hex',
							transform: 'ZeroExHex(value)',
						},
					},
				},
			},
		},
	},
	{
		id: 'evm-calldata-detail-page',
		route: 'evm-calldata-detail',
		kind: 'page',
		file: 'src/routes/(explore)/(evm)/evm/(calldata)/calldata/[hex]/+page.svelte',
		segments: [
			{
				kind: RouteSegmentKind.Group,
				value: 'explore',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'evm',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'evm',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'calldata',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'calldata',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'hex',
			},
		],
		urlPath: '/evm/calldata/[hex]',
		params: [
			routeParams[21],
		],
		component: {
			kind: RouteComponentKind.Page,
			children: [
				{
					kind: RouteComponentKind.EntityView,
					component: '$/views/EvmCalldataView.svelte',
					selection: {
						kind: RouteSelectionKind.EntitySelector,
						entity: EntityType.EvmCalldata,
						selector: {
							data: {
								kind: RouteSelectionKind.Param,
								param: 'data.selector',
							},
						},
					},
				},
			],
		},
	},
	{
		id: 'network-caip2-page',
		route: 'network-eip155',
		kind: 'page',
		file: 'src/routes/(explore)/(networks)/network/[caip2=networkCaip2]/+page.svelte',
		segments: [
			{
				kind: RouteSegmentKind.Group,
				value: 'explore',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'networks',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'network',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'caip2',
				matcher: 'networkCaip2',
			},
		],
		urlPath: '/network/[caip2=networkCaip2]',
		component: {
			kind: RouteComponentKind.Page,
			children: [
				{
					kind: RouteComponentKind.EntityView,
					component: '$/views/NetworkView.svelte',
					selection: {
						kind: RouteSelectionKind.ParamTransform,
						param: 'caip2',
						transform: 'networkSelectorFromCaip2(value)',
					},
				},
			],
		},
		notes: 'This route currently differs from the eip155 grouped route and requires importable selector-builder support.',
	},
] as const satisfies RouteFile[]

export const routeFamilies = [
	{
		id: 'social-youtube',
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'social',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'youtube',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'youtube',
			},
		],
		scope: 'public',
		hub: 'youtube',
		entity: EntityType.YouTubeNetwork,
		defaultView: '$/views/YouTubeView.svelte',
		members: [
			{
				id: 'youtube-channels',
				pathSuffix: [
					{
						kind: RouteSegmentKind.Static,
						value: 'channels',
					},
				],
				surface: 'list',
				entity: EntityType.YouTubeChannel,
				view: '$/views/YouTubeChannelsView.svelte',
				navigation: {
					id: 'social-youtube',
					title: 'Channels',
					parent: 'social',
				},
			},
			{
				id: 'youtube-channel',
				pathSuffix: [
					{
						kind: RouteSegmentKind.Static,
						value: 'channel',
					},
					{
						kind: RouteSegmentKind.Param,
						name: 'channelId',
					},
				],
				surface: 'detail',
				entity: EntityType.YouTubeChannel,
				view: '$/views/YouTubeChannelView.svelte',
				selection: {
					kind: RouteSelectionKind.EntitySelector,
					entity: EntityType.YouTubeChannel,
					selector: {
						channelId: {
							kind: RouteSelectionKind.Param,
							param: 'channelId',
						},
					},
				},
			},
			{
				id: 'youtube-channel-videos',
				pathSuffix: [
					{
						kind: RouteSegmentKind.Static,
						value: 'channel',
					},
					{
						kind: RouteSegmentKind.Param,
						name: 'channelId',
					},
					{
						kind: RouteSegmentKind.Group,
						value: 'channel',
					},
					{
						kind: RouteSegmentKind.Static,
						value: 'videos',
					},
				],
				surface: 'subview',
				entity: EntityType.YouTubeChannel,
				view: '$/views/YouTubeVideosView.svelte',
			},
			{
				id: 'youtube-video',
				pathSuffix: [
					{
						kind: RouteSegmentKind.Static,
						value: 'video',
					},
					{
						kind: RouteSegmentKind.Param,
						name: 'videoId',
					},
				],
				surface: 'detail',
				entity: EntityType.YouTubeVideo,
				view: '$/views/YouTubeVideoView.svelte',
			},
		],
		notes: 'Route families compactly describe repeated hub/list/detail/subview patterns; expansion still needs per-member page/layout/module declarations for exact file generation.',
	},
	{
		id: 'network-slug-lightning',
		root: [
			{
				kind: RouteSegmentKind.Group,
				value: 'explore',
			},
			{
				kind: RouteSegmentKind.Group,
				value: 'networks',
			},
			{
				kind: RouteSegmentKind.Static,
				value: 'network',
			},
			{
				kind: RouteSegmentKind.Param,
				name: 'networkSlug',
				matcher: 'networkSlug',
			},
		],
		scope: 'public',
		hub: 'network-slug',
		entity: EntityType.Network,
		defaultView: '$/views/NetworkView.svelte',
		members: [
			{
				id: 'network-slug-channels',
				pathSuffix: [
					{
						kind: RouteSegmentKind.Static,
						value: 'channels',
					},
				],
				surface: 'list',
				entity: EntityType.LightningChannel,
				view: '$/views/LightningChannelsView.svelte',
			},
			{
				id: 'network-slug-channel',
				pathSuffix: [
					{
						kind: RouteSegmentKind.Static,
						value: 'channels',
					},
					{
						kind: RouteSegmentKind.Param,
						name: 'channelId',
					},
				],
				surface: 'detail',
				entity: EntityType.LightningChannel,
				view: '$/views/LightningChannelView.svelte',
				selection: {
					kind: RouteSelectionKind.EntitySelector,
					entity: EntityType.LightningChannel,
					selector: {
						$network: {
							kind: RouteSelectionKind.EntitySelector,
							entity: EntityType.Network,
							selector: {
								slug: {
									kind: RouteSelectionKind.Param,
									param: 'networkSlug',
								},
							},
						},
						channelId: {
							kind: RouteSelectionKind.Param,
							param: 'channelId',
						},
					},
				},
			},
		],
		notes: 'This family also requires parent Network resource boundaries before rendering child Lightning views.',
	},
] as const satisfies RouteFamily[]

export const routeTopologyContract = [
	{
		family: 'networks',
		scope: RouteScope.Public,
		paths: [
			{ path: '/networks', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/network/[caip2=eip155NetworkCaip2]', surface: RouteSurface.Detail, entity: EntityType.EvmNetwork, selector: 'caip2' },
			{ path: '/network/[networkSlug=networkSlug]', surface: RouteSurface.Detail, entity: EntityType.Network, selector: 'slug' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/blocks', surface: RouteSurface.Subview, entity: EntityType.EvmNetwork, selector: 'caip2' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/block/[blockNumber=evmBlockNumber]', surface: RouteSurface.Detail, entity: EntityType.EvmBlock, selector: '$network+blockNumber' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/block/[hash]', surface: RouteSurface.Detail, entity: EntityType.EvmBlock, selector: '$network+hash' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/transactions', surface: RouteSurface.Subview, entity: EntityType.EvmNetwork, selector: 'caip2' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/tx/[transactionId=evmTxHash]', surface: RouteSurface.Detail, entity: EntityType.EvmTransaction, selector: '$network+hash' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/tx/[transactionId=evmTxHash]/log/[logIndex=nonNegativeInteger]', surface: RouteSurface.Detail, entity: EntityType.EvmLog, selector: '$transaction+logIndex' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/contracts', surface: RouteSurface.Subview, entity: EntityType.EvmNetwork, selector: 'caip2' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/contract/[address=evmAddress]', surface: RouteSurface.Detail, entity: EntityType.EvmContract, selector: '$network+address' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/account/[address=evmAddress]', surface: RouteSurface.Detail, entity: EntityType.EvmNetworkAccount, selector: '$network+address' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/blob/[transactionId=evmTxHash]/[blobIndex=nonNegativeInteger]', surface: RouteSurface.Detail, entity: EntityType.EvmBlob, selector: '$tx+blobIndex' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/upgrades', surface: RouteSurface.Subview, entity: EntityType.EvmNetwork, selector: 'caip2' },
			{ path: '/network/[caip2=eip155NetworkCaip2]/upgrade/[upgradeSlug]', surface: RouteSurface.Detail, entity: EntityType.EthereumNetworkUpgrade, selector: '$network+upgradeSlug' },
		],
	},
	{
		family: 'markets',
		scope: RouteScope.Public,
		paths: [
			{ path: '/markets', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/market/venues', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/market/venue/[marketVenueId=marketVenueId]', surface: RouteSurface.Detail, entity: EntityType.MarketVenue, selector: 'id' },
			{ path: '/market/venue/[marketVenueId=marketVenueId]/[baseCoinId]/[quoteCoinId]/[marketKind]', surface: RouteSurface.Detail, entity: EntityType.Market, selector: 'base+quote+marketVenue+marketKind', notes: 'Venue leads because it is the product context boundary.' },
			{ path: '/market/venue/[marketVenueId=marketVenueId]/[baseCoinId]/[quoteCoinId]/[marketKind]/quote/[timestampMs]/[feedKey]', surface: RouteSurface.Detail, entity: EntityType.Market_Timestamp, selector: '$market+timestampMs+feedKey' },
			{ path: '/market/venue/[marketVenueId=marketVenueId]/[baseCoinId]/[quoteCoinId]/[marketKind]/ohlc/[timeInterval]/[timestampMs]', surface: RouteSurface.Detail, entity: EntityType.Market_TimeInterval_Timestamp, selector: '$market+timeInterval+timestampMs' },
			{ path: '/market/venue/[marketVenueId=marketVenueId]/[baseCoinId]/[quoteCoinId]/[marketKind]/derivative/[timestampMs]/[feedKey]', surface: RouteSurface.Detail, entity: EntityType.Market_Derivative_Timestamp, selector: '$market+timestampMs+feedKey' },
		],
	},
	{
		family: 'assets',
		scope: RouteScope.Public,
		paths: [
			{ path: '/assets', surface: RouteSurface.Hub, entity: EntityType._Global, selector: 'scope' },
			{ path: '/coins', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/coin/[coinId]', surface: RouteSurface.Detail, entity: EntityType.Coin, selector: 'id' },
			{ path: '/coin/[coinId]/timestamp/[timestampMs]/[source]', surface: RouteSurface.Detail, entity: EntityType.Coin_Timestamp, selector: '$coin+timestampMs+source' },
			{ path: '/currencies', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/currency/[iso4217=iso4217]', surface: RouteSurface.Detail, entity: EntityType.Currency, selector: 'iso4217' },
			{ path: '/currency/[iso4217=iso4217]/timestamp/[timestampMs]', surface: RouteSurface.Detail, entity: EntityType.Currency_Timestamp, selector: '$currency+timestampMs' },
			{ path: '/pools', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/pool/[chainId=eip155ChainId]/[poolId]', surface: RouteSurface.Detail, entity: EntityType.LiquidityPool, selector: 'chainId+poolId' },
			{ path: '/vaults', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/vault/[chainId=eip155ChainId]/[vaultId]', surface: RouteSurface.Detail, entity: EntityType.Erc4626Vault, selector: '$network+address' },
			{ path: '/channels', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/channel/[channelId]', surface: RouteSurface.Detail, selector: 'channelId' },
			{ path: '/leverage', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/position/[positionId]', surface: RouteSurface.Detail, entity: EntityType.LiquidityPosition, selector: 'id' },
		],
	},
	{
		family: 'bridge-swap-cashu-cctp',
		scope: RouteScope.Public,
		paths: [
			{ path: '/bridge/routes', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/bridge/route/[routeId]', surface: RouteSurface.Detail, entity: EntityType.BridgeRoute, selector: 'id' },
			{ path: '/bridge/route/[routeId]/quote/[timestampMs]', surface: RouteSurface.Detail, entity: EntityType.BridgeRouteQuote_Timestamp, selector: '$route+timestampMs' },
			{ path: '/bridge/transfer/[transferId]', surface: RouteSurface.Detail, entity: EntityType.BridgeTransfer, selector: 'id' },
			{ path: '/swap/quotes', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/swap/quote/[quoteId]', surface: RouteSurface.Detail, entity: EntityType.SwapQuote, selector: 'id' },
			{ path: '/swap/quote/[quoteId]/timestamp/[timestampMs]', surface: RouteSurface.Detail, entity: EntityType.SwapQuote_Timestamp, selector: '$quote+timestampMs' },
			{ path: '/cashu/mints', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/cashu/mint/[mintUrl]', surface: RouteSurface.Detail, entity: EntityType.CashuMint, selector: 'url' },
			{ path: '/cashu/mint/[mintUrl]/keyset/[keysetId]', surface: RouteSurface.Detail, entity: EntityType.CashuKeyset, selector: '$mint+id' },
			{ path: '/cctp/allowance/[apiHost]', surface: RouteSurface.Detail, entity: EntityType.CctpAllowance, selector: 'apiHost' },
			{ path: '/cctp/message/[messageId]', surface: RouteSurface.Detail, entity: EntityType.CctpMessage, selector: 'id' },
		],
	},
	{
		family: 'data',
		scope: RouteScope.Public,
		paths: [
			{ path: '/ipfs/[namespace]/[target]', surface: RouteSurface.Detail, entity: EntityType.IpfsResource, selector: 'namespace+target' },
			{ path: '/ipfs/[namespace]/[target]/path/[...contentPath]', surface: RouteSurface.Resource, entity: EntityType.IpfsResource, selector: 'namespace+target+contentPath' },
			{ path: '/swarm/[reference]', surface: RouteSurface.Detail, entity: EntityType.SwarmResource, selector: 'reference' },
			{ path: '/swarm/[reference]/path/[...contentPath]', surface: RouteSurface.Resource, entity: EntityType.SwarmResource, selector: 'reference+contentPath' },
			{ path: '/arweave/[scope]', surface: RouteSurface.Hub, entity: EntityType._GlobalArweaveNetwork, selector: 'scope' },
			{ path: '/arweave/resource/[transactionId]/[contentPath]', surface: RouteSurface.Detail, entity: EntityType.ArweaveResource, selector: 'transactionId+contentPath' },
			{ path: '/url/[url]', surface: RouteSurface.Detail, entity: EntityType.Url, selector: 'url' },
			{ path: '/media/[url]', surface: RouteSurface.Detail, entity: EntityType.Media, selector: 'url' },
			{ path: '/media/object/[url]', surface: RouteSurface.Detail, entity: EntityType.MediaObject, selector: 'url' },
		],
	},
	{
		family: 'git',
		scope: RouteScope.Public,
		paths: [
			{ path: '/git/repository/repository-id/[repositoryId]', surface: RouteSurface.Detail, entity: EntityType.GitRepository, selector: 'repositoryId' },
			{ path: '/git/repository/canonical-remote-url/[canonicalRemoteUrl]', surface: RouteSurface.Detail, entity: EntityType.GitRepository, selector: 'canonicalRemoteUrl' },
			{ path: '/git/repository/repository-id/[repositoryId]/ref/[refName]', surface: RouteSurface.Detail, entity: EntityType.GitRef, selector: '$repository+refName' },
			{ path: '/git/repository/canonical-remote-url/[canonicalRemoteUrl]/ref/[refName]', surface: RouteSurface.Detail, entity: EntityType.GitRef, selector: '$repository+refName' },
			{ path: '/git/object/[objectId]/[objectFormat]', surface: RouteSurface.Detail, entity: EntityType.GitObject, selector: 'objectId+objectFormat' },
			{ path: '/git/blob/[objectId]/[objectFormat]', surface: RouteSurface.Detail, entity: EntityType.GitBlob, selector: 'objectId+objectFormat' },
			{ path: '/git/tree/[objectId]/[objectFormat]', surface: RouteSurface.Detail, entity: EntityType.GitTree, selector: 'objectId+objectFormat' },
			{ path: '/git/tree/[objectId]/[objectFormat]/entry/[path]', surface: RouteSurface.Detail, entity: EntityType.GitTreeEntry, selector: '$tree+path' },
			{ path: '/git/commit/[objectId]/[objectFormat]', surface: RouteSurface.Detail, entity: EntityType.GitCommit, selector: 'objectId+objectFormat' },
			{ path: '/git/tag/[objectId]/[objectFormat]', surface: RouteSurface.Detail, entity: EntityType.GitTag, selector: 'objectId+objectFormat' },
		],
	},
	{
		family: 'social',
		scope: RouteScope.Public,
		paths: [
			{ path: '/social', surface: RouteSurface.Hub, entity: EntityType._Global, selector: 'scope' },
			{ path: '/activitypub', surface: RouteSurface.Hub, entity: EntityType._GlobalActivityPubNetwork, selector: 'scope' },
			{ path: '/activitypub/actors', surface: RouteSurface.List, entity: EntityType._GlobalActivityPubNetwork, selector: 'scope' },
			{ path: '/activitypub/actor/[instanceOrigin]/[localAccountId]', surface: RouteSurface.Detail, entity: EntityType.ActivityPubActor, selector: 'instanceOrigin+localAccountId' },
			{ path: '/activitypub/actor/[activityStreamsUri]', surface: RouteSurface.Detail, entity: EntityType.ActivityPubActor, selector: 'activityStreamsUri' },
			{ path: '/activitypub/notes', surface: RouteSurface.List, entity: EntityType._GlobalActivityPubNetwork, selector: 'scope' },
			{ path: '/activitypub/note/[instanceOrigin]/[localStatusId]', surface: RouteSurface.Detail, entity: EntityType.ActivityPubNote, selector: 'instanceOrigin+localStatusId' },
			{ path: '/activitypub/note/[activityStreamsUri]', surface: RouteSurface.Detail, entity: EntityType.ActivityPubNote, selector: 'activityStreamsUri' },
			{ path: '/atproto', surface: RouteSurface.Hub, entity: EntityType._GlobalAtprotoNetwork, selector: 'scope' },
			{ path: '/atproto/actors', surface: RouteSurface.List, entity: EntityType._GlobalAtprotoNetwork, selector: 'scope' },
			{ path: '/atproto/actor/[did]', surface: RouteSurface.Detail, entity: EntityType.AtprotoActor, selector: 'did' },
			{ path: '/atproto/actor/[handle]', surface: RouteSurface.Detail, entity: EntityType.AtprotoActor, selector: 'handle' },
			{ path: '/atproto/posts', surface: RouteSurface.List, entity: EntityType._GlobalAtprotoNetwork, selector: 'scope' },
			{ path: '/atproto/post/[...uri]', surface: RouteSurface.Detail, entity: EntityType.AtprotoPost, selector: 'uri' },
			{ path: '/farcaster', surface: RouteSurface.Hub, entity: EntityType._GlobalFarcasterNetwork, selector: 'scope' },
			{ path: '/farcaster/feed', surface: RouteSurface.List, entity: EntityType._GlobalFarcasterNetwork, selector: 'scope' },
			{ path: '/farcaster/cast/[fid=farcasterFid]/[hash]', surface: RouteSurface.Detail, entity: EntityType.FarcasterCast, selector: 'fid+hash' },
			{ path: '/farcaster/cast/[fname]/[hash]', surface: RouteSurface.Detail, entity: EntityType.FarcasterCast, selector: 'fname+hash' },
			{ path: '/farcaster/channels', surface: RouteSurface.List, entity: EntityType._GlobalFarcasterNetwork, selector: 'scope' },
			{ path: '/farcaster/channel/[channelId]', surface: RouteSurface.Detail, entity: EntityType.FarcasterChannel, selector: 'id' },
			{ path: '/farcaster/users', surface: RouteSurface.List, entity: EntityType._GlobalFarcasterNetwork, selector: 'scope' },
			{ path: '/farcaster/user/[userId=farcasterFid]', surface: RouteSurface.Detail, entity: EntityType.FarcasterUser, selector: 'fid' },
			{ path: '/lens', surface: RouteSurface.Hub, entity: EntityType._GlobalLensNetwork, selector: 'scope' },
			{ path: '/lens/accounts', surface: RouteSurface.List, entity: EntityType._GlobalLensNetwork, selector: 'scope' },
			{ path: '/lens/account/[accountAddress=evmAddress]', surface: RouteSurface.Detail, entity: EntityType.LensAccount, selector: 'address' },
			{ path: '/lens/posts', surface: RouteSurface.List, entity: EntityType._GlobalLensNetwork, selector: 'scope' },
			{ path: '/lens/post/[postId]', surface: RouteSurface.Detail, entity: EntityType.LensPost, selector: 'id' },
			{ path: '/nostr', surface: RouteSurface.Hub, entity: EntityType._GlobalNostrNetwork, selector: 'scope' },
			{ path: '/nostr/profiles', surface: RouteSurface.List, entity: EntityType._GlobalNostrNetwork, selector: 'scope' },
			{ path: '/nostr/profile/[pubkey]', surface: RouteSurface.Detail, entity: EntityType.NostrProfile, selector: 'pubkey' },
			{ path: '/nostr/notes', surface: RouteSurface.List, entity: EntityType._GlobalNostrNetwork, selector: 'scope' },
			{ path: '/nostr/note/[eventId]', surface: RouteSurface.Detail, entity: EntityType.NostrNote, selector: 'id' },
			{ path: '/nostr/articles', surface: RouteSurface.List, entity: EntityType._GlobalNostrNetwork, selector: 'scope' },
			{ path: '/nostr/article/[eventId]', surface: RouteSurface.Detail, entity: EntityType.NostrArticle, selector: 'id' },
			{ path: '/nostr/relays', surface: RouteSurface.List, entity: EntityType._GlobalNostrNetwork, selector: 'scope' },
			{ path: '/nostr/relay/[relayUrl]', surface: RouteSurface.Detail, entity: EntityType.NostrRelay, selector: 'url' },
			{ path: '/reddit', surface: RouteSurface.Hub, entity: EntityType._GlobalRedditNetwork, selector: 'scope' },
			{ path: '/reddit/subreddits', surface: RouteSurface.List, entity: EntityType._GlobalRedditNetwork, selector: 'scope' },
			{ path: '/reddit/subreddit/[subreddit]', surface: RouteSurface.Detail, entity: EntityType.RedditSubreddit, selector: 'name' },
			{ path: '/reddit/links', surface: RouteSurface.List, entity: EntityType._GlobalRedditNetwork, selector: 'scope' },
			{ path: '/reddit/link/[linkId]', surface: RouteSurface.Detail, entity: EntityType.RedditLink, selector: 'id' },
			{ path: '/rss', surface: RouteSurface.Hub, entity: EntityType._GlobalRssNetwork, selector: 'scope' },
			{ path: '/rss/feeds', surface: RouteSurface.List, entity: EntityType._GlobalRssNetwork, selector: 'scope' },
			{ path: '/rss/feed/[feedKey]', surface: RouteSurface.Detail, entity: EntityType.RssFeed, selector: 'key' },
			{ path: '/rss/items', surface: RouteSurface.List, entity: EntityType._GlobalRssNetwork, selector: 'scope' },
			{ path: '/rss/item/[itemId]', surface: RouteSurface.Detail, entity: EntityType.RssItem, selector: 'id' },
			{ path: '/x', surface: RouteSurface.Hub, entity: EntityType._GlobalXNetwork, selector: 'scope' },
			{ path: '/x/posts', surface: RouteSurface.List, entity: EntityType._GlobalXNetwork, selector: 'scope' },
			{ path: '/x/post/[postId]', surface: RouteSurface.Detail, entity: EntityType.XPost, selector: 'id' },
			{ path: '/xmtp', surface: RouteSurface.Hub, entity: EntityType.XmtpNetwork, selector: 'scope' },
			{ path: '/xmtp/conversations', surface: RouteSurface.List, entity: EntityType.XmtpNetwork, selector: 'scope' },
			{ path: '/xmtp/conversation/[conversationId]', surface: RouteSurface.Detail, entity: EntityType.XmtpConversation, selector: 'id' },
			{ path: '/youtube', surface: RouteSurface.Hub, entity: EntityType._GlobalYouTubeNetwork, selector: 'scope' },
			{ path: '/youtube/channels', surface: RouteSurface.List, entity: EntityType._GlobalYouTubeNetwork, selector: 'scope' },
			{ path: '/youtube/channel/[channelId]', surface: RouteSurface.Detail, entity: EntityType.YouTubeChannel, selector: 'channelId' },
			{ path: '/youtube/channel/[channelId]/videos', surface: RouteSurface.Subview, entity: EntityType.YouTubeChannel, selector: 'channelId' },
			{ path: '/youtube/channel/[channelId]/playlists', surface: RouteSurface.Subview, entity: EntityType.YouTubeChannel, selector: 'channelId' },
			{ path: '/youtube/videos', surface: RouteSurface.List, entity: EntityType._GlobalYouTubeNetwork, selector: 'scope' },
			{ path: '/youtube/video/[videoId]', surface: RouteSurface.Detail, entity: EntityType.YouTubeVideo, selector: 'videoId' },
			{ path: '/youtube/video/[videoId]/comments', surface: RouteSurface.Subview, entity: EntityType.YouTubeVideo, selector: 'videoId' },
			{ path: '/youtube/playlists', surface: RouteSurface.List, entity: EntityType._GlobalYouTubeNetwork, selector: 'scope' },
			{ path: '/youtube/playlist/[playlistId]', surface: RouteSurface.Detail, entity: EntityType.YouTubePlaylist, selector: 'playlistId' },
			{ path: '/youtube/playlist/[playlistId]/videos', surface: RouteSurface.Subview, entity: EntityType.YouTubePlaylist, selector: 'playlistId' },
		],
	},
	{
		family: 'local',
		scope: RouteScope.Local,
		paths: [
			{ path: '/~/accounts', surface: RouteSurface.Hub, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/accounts/connections', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/accounts/connection/[walletId]', surface: RouteSurface.Detail, entity: EntityType.BlockheadWalletConnection, selector: '$wallet' },
			{ path: '/~/accounts/balances', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', surface: RouteSurface.Detail, entity: EntityType.EvmNetworkActorCoinBalance, selector: '$actor+$contract' },
			{ path: '/~/accounts/allowances', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', surface: RouteSurface.Detail, entity: EntityType.EvmActorCoinAllowance, selector: '$actor+$contract+$spender+interopAddress' },
			{ path: '/~/accounts/positions', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/accounts/position/[chainId=eip155ChainId]/[positionId]', surface: RouteSurface.Detail, entity: EntityType.LiquidityPosition, selector: 'chainId+positionId' },
			{ path: '/~/accounts/transactions', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash]/[createdAt]', surface: RouteSurface.Detail, entity: EntityType.BlockheadBridgeTransaction, selector: '$account+$sourceTx+createdAt' },
			{ path: '/~/agents', surface: RouteSurface.Hub, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/agents/conversations', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/agents/conversation/[conversationId]', surface: RouteSurface.Detail, entity: EntityType.BlockheadAgentConversation, selector: 'id' },
			{ path: '/~/session/[sessionId]', surface: RouteSurface.Detail, entity: EntityType.BlockheadSession, selector: 'id' },
			{ path: '/~/manage', surface: RouteSurface.Hub, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/manage/sources', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/manage/source/[sourceId]', surface: RouteSurface.Detail, entity: EntityType.BlockheadSource, selector: 'id' },
			{ path: '/~/multiplayer', surface: RouteSurface.Hub, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/multiplayer/rooms', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/multiplayer/room/[roomId]', surface: RouteSurface.Detail, entity: EntityType.BlockheadRoom, selector: 'id' },
			{ path: '/~/multiplayer/contacts', surface: RouteSurface.List, entity: EntityType._Global, selector: 'scope' },
			{ path: '/~/multiplayer/contact/[contactId]', surface: RouteSurface.Detail, entity: EntityType.BlockheadRoomPeer, selector: 'id' },
		],
	},
] as const satisfies readonly RouteTopologyContract[]

export const simpleEntityPageRoutes = [
	{
		file: 'src/routes/(assets)/(coinInstances)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]/+page.svelte',
		entity: EntityType.EvmCoinInstance,
		component: 'EvmCoinInstanceView',
	},
	{
		file: 'src/routes/(explore)/(evm)/evm/(calldata)/calldata/[hex]/+page.svelte',
		entity: EntityType.EvmCalldata,
		component: 'EvmCalldataView',
	},
	{
		file: 'src/routes/(explore)/(evm)/evm/(errors)/error/[hex]/+page.svelte',
		entity: EntityType.EvmError,
		component: 'EvmErrorView',
	},
	{
		file: 'src/routes/(explore)/(evm)/evm/(selectors)/selector/[hex]/+page.svelte',
		entity: EntityType.EvmSelector,
		component: 'EvmSelectorView',
	},
	{
		file: 'src/routes/(explore)/(evm)/evm/(topics)/topic/[hex]/+page.svelte',
		entity: EntityType.EvmTopic,
		component: 'EvmTopicView',
	},
	{
		file: 'src/routes/(social)/(nostr)/nostr/article/[pubkey]/[identifier]/+page.svelte',
		entity: EntityType.NostrArticle,
		component: 'NostrArticleView',
	},
	{
		file: 'src/routes/(social)/(nostr)/nostr/note/[eventId]/+page.svelte',
		entity: EntityType.NostrNote,
		component: 'NostrNoteView',
	},
	{
		file: 'src/routes/(social)/(nostr)/nostr/profile/[pubkey]/+page.svelte',
		entity: EntityType.NostrProfile,
		component: 'NostrProfileView',
	},
	{
		file: 'src/routes/(social)/(nostr)/nostr/reaction/[eventId]/+page.svelte',
		entity: EntityType.NostrReaction,
		component: 'NostrReactionView',
	},
	{
		file: 'src/routes/(social)/(nostr)/nostr/relay/[relayKey]/+page.svelte',
		entity: EntityType.NostrRelay,
		component: 'NostrRelayView',
	},
	{
		file: 'src/routes/(social)/(nostr)/nostr/repost/[eventId]/+page.svelte',
		entity: EntityType.NostrRepost,
		component: 'NostrRepostView',
	},
	{
		file: 'src/routes/account/[address=evmAddress]/+page.svelte',
		entity: EntityType.EvmAccount,
		component: 'EvmAccountView',
	},
	{
		file: 'src/routes/bridge/route/[routeId]/+page.svelte',
		entity: EntityType.BridgeRoute,
		component: 'BridgeRouteView',
	},
	{
		file: 'src/routes/bridge/route/[routeId]/step/[stepIndex=bridgeRouteStepIndex]/+page.svelte',
		entity: EntityType.BridgeRouteStep,
		component: 'BridgeRouteStepView',
	},
	{
		file: 'src/routes/url/[url]/+page.svelte',
		entity: EntityType.Url,
		component: 'UrlView',
	},
	{
		file: 'src/routes/~/(accounts)/accounts/connections/[walletId]/+page.svelte',
		entity: EntityType.BlockheadWalletConnection,
		component: 'BlockheadWalletConnectionView',
	},
] as const satisfies SimpleEntityPageRoute[]

export const staticParentPageLayoutRoutes = [
	{
		file: 'src/routes/(assets)/(channels)/+layout.svelte',
		title: 'Channels',
		href: {
			path: '/channels',
		},
	},
	{
		file: 'src/routes/(assets)/(channels)/channel/[channelId]/(channel)/+layout.svelte',
		title: 'Channels',
		href: {
			path: '/channels',
		},
		id: {
			value: 'channels',
		},
	},
	{
		file: 'src/routes/(assets)/(coins)/+layout.svelte',
		title: 'Coins',
		href: {
			path: '/coins',
		},
	},
	{
		file: 'src/routes/(assets)/(coins)/coin/[coinId]/(coin)/+layout.svelte',
		title: 'Coins',
		href: {
			path: '/coins',
		},
		id: {
			value: 'coins',
		},
	},
	{
		file: 'src/routes/(assets)/(currencies)/+layout.svelte',
		title: 'Currencies',
		href: {
			path: '/currencies',
		},
	},
	{
		file: 'src/routes/(assets)/(currencies)/currency/[iso4217=iso4217]/(currency)/+layout.svelte',
		title: 'Currencies',
		href: {
			path: '/currencies',
		},
		id: {
			value: 'currencies',
		},
	},
	{
		file: 'src/routes/(assets)/(leverage)/+layout.svelte',
		title: 'Leverage',
		href: {
			path: '/leverage',
		},
	},
	{
		file: 'src/routes/(assets)/(leverage)/position/[positionId]/(position)/+layout.svelte',
		title: 'Leverage',
		href: {
			path: '/leverage',
		},
		id: {
			value: 'leverage',
		},
	},
	{
		file: 'src/routes/(assets)/(marketVenues)/+layout.svelte',
		title: 'Market venues',
		href: {
			path: '/market-venues',
		},
	},
	{
		file: 'src/routes/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]/(marketVenue)/+layout.svelte',
		title: 'Market venues',
		href: {
			path: '/market-venues',
		},
		id: {
			value: 'market-venues',
		},
	},
	{
		file: 'src/routes/(assets)/(markets)/+layout.svelte',
		title: 'Markets',
		href: {
			path: '/markets',
		},
	},
	{
		file: 'src/routes/(assets)/(markets)/market/[marketKey]/(market)/+layout.svelte',
		title: 'Markets',
		href: {
			path: '/markets',
		},
		id: {
			value: 'markets',
		},
	},
	{
		file: 'src/routes/(assets)/(pools)/+layout.svelte',
		title: 'Pools',
		href: {
			path: '/pools',
		},
	},
	{
		file: 'src/routes/(assets)/(pools)/pool/[chainId=eip155ChainId]/[poolId]/(pool)/+layout.svelte',
		title: 'Pools',
		href: {
			path: '/pools',
		},
		id: {
			value: 'pools',
		},
	},
	{
		file: 'src/routes/(assets)/(vaults)/+layout.svelte',
		title: 'Vaults',
		href: {
			path: '/vaults',
		},
	},
	{
		file: 'src/routes/(assets)/(vaults)/vault/[chainId=eip155ChainId]/[vaultId]/(vault)/+layout.svelte',
		title: 'Vaults',
		href: {
			path: '/vaults',
		},
		id: {
			value: 'vaults',
		},
	},
	{
		file: 'src/routes/(assets)/+layout.svelte',
		title: 'Assets',
		href: {
			path: '/assets',
		},
	},
	{
		file: 'src/routes/(assets)/coins/+layout.svelte',
		title: 'Coins',
		href: {
			path: '/coins',
		},
	},
	{
		file: 'src/routes/(assets)/currencies/+layout.svelte',
		title: 'Currencies',
		href: {
			path: '/currencies',
		},
	},
	{
		file: 'src/routes/(assets)/market-venues/+layout.svelte',
		title: 'Market venues',
		href: {
			path: '/market-venues',
		},
	},
	{
		file: 'src/routes/(assets)/markets/+layout.svelte',
		title: 'Markets',
		href: {
			path: '/markets',
		},
	},
	{
		file: 'src/routes/(demo)/+layout.svelte',
		title: 'Demo',
		href: {
			path: '/demo',
		},
	},
	{
		file: 'src/routes/(explore)/(ens)/+layout.svelte',
		title: 'ENS',
		href: {
			path: '/ens',
		},
		id: {
			value: 'ens',
		},
	},
	{
		file: 'src/routes/(explore)/(evm)/evm/(calldata)/+layout.svelte',
		title: 'Calldata',
		href: {
			path: '/evm/calldata',
		},
		id: {
			value: 'evm-calldata',
		},
	},
	{
		file: 'src/routes/(explore)/(evm)/evm/(errors)/+layout.svelte',
		title: 'Errors',
		href: {
			path: '/evm/errors',
		},
		id: {
			value: 'evm-errors',
		},
	},
	{
		file: 'src/routes/(explore)/(evm)/evm/(selectors)/+layout.svelte',
		title: 'Selectors',
		href: {
			path: '/evm/selectors',
		},
		id: {
			value: 'evm-selectors',
		},
	},
	{
		file: 'src/routes/(explore)/(evm)/evm/(topics)/+layout.svelte',
		title: 'Topics',
		href: {
			path: '/evm/topics',
		},
		id: {
			value: 'evm-topics',
		},
	},
	{
		file: 'src/routes/(explore)/(evm)/evm/+layout.svelte',
		title: 'EVM',
		href: {
			path: '/evm',
		},
		id: {
			value: 'evm',
		},
	},
	{
		file: 'src/routes/(explore)/(networks)/+layout.svelte',
		title: 'Networks',
		href: {
			path: '/networks',
		},
		id: {
			value: 'networks',
		},
	},
	{
		file: 'src/routes/(explore)/(proposals)/+layout.svelte',
		title: 'Proposals',
		href: {
			path: '/proposals',
		},
	},
	{
		file: 'src/routes/(explore)/(services)/services/+layout.svelte',
		title: 'Services',
		href: {
			path: '/services',
		},
		id: {
			value: 'services',
		},
	},
	{
		file: 'src/routes/(explore)/+layout.svelte',
		title: 'Explore',
		href: {
			path: '/explore',
		},
	},
	{
		file: 'src/routes/(social)/(farcaster)/farcaster/(accounts)/+layout.svelte',
		title: 'Accounts',
		href: {
			path: '/farcaster/accounts',
		},
	},
	{
		file: 'src/routes/(social)/(farcaster)/farcaster/(channels)/+layout.svelte',
		title: 'Channels',
		href: {
			path: '/farcaster/channels',
		},
	},
	{
		file: 'src/routes/(social)/(farcaster)/farcaster/(feed)/+layout.svelte',
		title: 'Feed',
		href: {
			path: '/farcaster/feed',
		},
	},
	{
		file: 'src/routes/(social)/(farcaster)/farcaster/(users)/+layout.svelte',
		title: 'Users',
		href: {
			path: '/farcaster/users',
		},
	},
	{
		file: 'src/routes/(social)/(farcaster)/farcaster/feed/+layout.svelte',
		title: 'Feed',
		href: {
			path: '/farcaster/feed',
		},
	},
	{
		file: 'src/routes/(social)/(xmtp)/xmtp/(accounts)/+layout.svelte',
		title: 'Accounts',
		href: {
			path: '/xmtp/accounts',
		},
	},
	{
		file: 'src/routes/(social)/+layout.svelte',
		title: 'Social',
		href: {
			path: '/social',
		},
	},
	{
		file: 'src/routes/~/(accounts)/accounts/(allowances)/+layout.svelte',
		title: 'Allowances',
		href: {
			path: '/~/accounts/allowances',
		},
	},
	{
		file: 'src/routes/~/(accounts)/accounts/(balances)/+layout.svelte',
		title: 'Balances',
		href: {
			path: '/~/accounts/balances',
		},
	},
	{
		file: 'src/routes/~/(accounts)/accounts/(positions)/+layout.svelte',
		title: 'Positions',
		href: {
			path: '/~/accounts/positions',
		},
	},
	{
		file: 'src/routes/~/(accounts)/accounts/(transactions)/+layout.svelte',
		title: 'Transactions',
		href: {
			path: '/~/accounts/transactions',
		},
	},
	{
		file: 'src/routes/~/(agents)/+layout.svelte',
		title: 'Agents',
		href: {
			path: '/~/agents',
		},
		id: {
			value: 'agents',
		},
	},
	{
		file: 'src/routes/~/(agents)/agents/(conversations)/+layout.svelte',
		title: 'Conversations',
		href: {
			path: '/~/agents/conversations',
		},
	},
	{
		file: 'src/routes/~/(agents)/agents/(conversations)/conversation/[conversationId]/(conversation)/+layout.svelte',
		title: 'Conversations',
		href: {
			path: '/~/agents/conversations',
		},
		id: {
			value: 'agents',
		},
	},
	{
		file: 'src/routes/~/(manage)/manage/(sources)/+layout.svelte',
		title: 'Sources',
		href: {
			path: '/~/manage/sources',
		},
	},
	{
		file: 'src/routes/~/(multiplayer)/+layout.svelte',
		title: 'Multiplayer',
		href: {
			path: '/~/multiplayer',
		},
	},
	{
		file: 'src/routes/~/(multiplayer)/multiplayer/(contacts)/+layout.svelte',
		title: 'Contacts',
		href: {
			path: '/~/multiplayer/contacts',
		},
	},
	{
		file: 'src/routes/~/(multiplayer)/multiplayer/(rooms)/+layout.svelte',
		title: 'Rooms',
		href: {
			path: '/~/multiplayer/rooms',
		},
	},
] as const satisfies StaticParentPageLayoutRoute[]

export const staticEntityParentPageLayoutRoutes = [
	{
		file: 'src/routes/(social)/(atproto)/+layout.svelte',
		entity: EntityType.AtprotoNetwork,
		component: {
			name: 'AtprotoView',
		},
		href: {
			path: '/atproto',
		},
		selector: {
			field: 'scope',
			value: 'AtprotoNetwork',
		},
	},
	{
		file: 'src/routes/(social)/(farcaster)/+layout.svelte',
		entity: EntityType.FarcasterNetwork,
		component: {
			name: 'FarcasterView',
		},
		href: {
			path: '/farcaster',
		},
		selector: {
			field: 'scope',
			value: 'FarcasterNetwork',
		},
	},
	{
		file: 'src/routes/(social)/(xmtp)/+layout.svelte',
		entity: EntityType.XmtpNetwork,
		component: {
			name: 'XmtpView',
		},
		href: {
			path: '/xmtp',
		},
		selector: {
			field: 'scope',
			value: 'XmtpNetwork',
		},
	},
	{
		file: 'src/routes/(social)/(youtube)/+layout.svelte',
		entity: EntityType.YouTubeNetwork,
		component: {
			name: 'YouTubeView',
		},
		href: {
			path: '/youtube',
		},
		selector: {
			field: 'scope',
			value: 'YouTubeNetwork',
		},
	},
] as const satisfies StaticEntityParentPageLayoutRoute[]

export const paramEntityParentPageLayoutRoutes = [
	{
		file: 'src/routes/(social)/(atproto)/atproto/post/[...uri]/(post)/+layout.svelte',
		entity: EntityType.AtprotoPost,
		component: {
			name: 'AtprotoPostView',
		},
		href: {
			path: '/(social)/(atproto)/atproto/post/[...uri]',
		},
		param: {
			route: 'uri',
			local: 'uri',
			value: "page.params.uri ?? ''",
		},
		hrefParam: {
			route: 'uri',
			value: 'encodeURIComponent(uri)',
		},
		id: {
			value: 'uri',
		},
		selector: {
			field: 'uri',
			value: 'decodeURIComponent(uri)',
		},
	},
	{
		file: 'src/routes/(social)/(lens)/lens/post/[postId]/(post)/+layout.svelte',
		entity: EntityType.LensPost,
		component: {
			name: 'LensPostView',
		},
		href: {
			path: '/(social)/(lens)/lens/post/[postId]',
		},
		param: {
			route: 'postId',
			local: 'postId',
			value: "page.params.postId ?? ''",
		},
		hrefParam: {
			route: 'postId',
			value: 'encodeURIComponent(postId)',
		},
		id: {
			value: 'postId',
		},
		selector: {
			field: 'id',
			value: 'decodeURIComponent(postId)',
		},
	},
	{
		file: 'src/routes/(social)/(reddit)/reddit/comment/[fullname]/(comment)/+layout.svelte',
		entity: EntityType.RedditComment,
		component: {
			name: 'RedditCommentView',
		},
		href: {
			path: '/(social)/(reddit)/reddit/comment/[fullname]',
		},
		param: {
			route: 'fullname',
			local: 'fullname',
			value: "page.params.fullname ?? ''",
		},
		hrefParam: {
			route: 'fullname',
			value: 'encodeURIComponent(fullname)',
		},
		id: {
			value: 'fullname',
		},
		selector: {
			field: 'fullname',
			value: 'decodeURIComponent(fullname)',
		},
	},
	{
		file: 'src/routes/(social)/(reddit)/reddit/link/[fullname]/(link)/+layout.svelte',
		entity: EntityType.RedditLink,
		component: {
			name: 'RedditLinkView',
		},
		href: {
			path: '/(social)/(reddit)/reddit/link/[fullname]',
		},
		param: {
			route: 'fullname',
			local: 'fullname',
			value: "page.params.fullname ?? ''",
		},
		hrefParam: {
			route: 'fullname',
			value: 'encodeURIComponent(fullname)',
		},
		id: {
			value: 'fullname',
		},
		selector: {
			field: 'fullname',
			value: 'decodeURIComponent(fullname)',
		},
	},
	{
		file: 'src/routes/(social)/(youtube)/youtube/channel/[channelId]/(channel)/+layout.svelte',
		entity: EntityType.YouTubeChannel,
		component: {
			name: 'YouTubeChannelView',
		},
		href: {
			path: '/(social)/(youtube)/youtube/channel/[channelId]',
		},
		param: {
			route: 'channelId',
			local: 'channelId',
			value: "page.params.channelId ?? ''",
		},
		hrefParam: {
			route: 'channelId',
			value: 'encodeURIComponent(channelId)',
		},
		id: {
			value: 'channelId',
		},
		selector: {
			field: 'channelId',
			value: 'decodeURIComponent(channelId)',
		},
	},
	{
		file: 'src/routes/(social)/(youtube)/youtube/playlist/[playlistId]/(playlist)/+layout.svelte',
		entity: EntityType.YouTubePlaylist,
		component: {
			name: 'YouTubePlaylistView',
		},
		href: {
			path: '/(social)/(youtube)/youtube/playlist/[playlistId]',
		},
		param: {
			route: 'playlistId',
			local: 'playlistId',
			value: "page.params.playlistId ?? ''",
		},
		hrefParam: {
			route: 'playlistId',
			value: 'encodeURIComponent(playlistId)',
		},
		id: {
			value: 'playlistId',
		},
		selector: {
			field: 'playlistId',
			value: 'decodeURIComponent(playlistId)',
		},
	},
	{
		file: 'src/routes/(social)/(youtube)/youtube/video/[videoId]/(video)/+layout.svelte',
		entity: EntityType.YouTubeVideo,
		component: {
			name: 'YouTubeVideoView',
		},
		href: {
			path: '/(social)/(youtube)/youtube/video/[videoId]',
		},
		param: {
			route: 'videoId',
			local: 'videoId',
			value: "page.params.videoId ?? ''",
		},
		hrefParam: {
			route: 'videoId',
			value: 'encodeURIComponent(videoId)',
		},
		id: {
			value: 'videoId',
		},
		selector: {
			field: 'videoId',
			value: 'decodeURIComponent(videoId)',
		},
	},
] as const satisfies ParamEntityParentPageLayoutRoute[]

export const multiParamEntityParentPageLayoutRoutes = [
	{
		file: 'src/routes/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/(actor)/+layout.svelte',
		entity: EntityType.ActivityPubActor,
		component: {
			name: 'ActivityPubActorView',
		},
		href: {
			path: '/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]',
		},
		params: [
			{
				route: 'instanceOrigin',
				local: 'instanceOrigin',
				value: "page.params.instanceOrigin ?? ''",
				hrefParam: {
					route: 'instanceOrigin',
					value: 'encodeURIComponent(instanceOrigin)',
				},
				selector: {
					field: 'instanceOrigin',
					value: 'decodeURIComponent(instanceOrigin)',
				},
			},
			{
				route: 'localAccountId',
				local: 'localAccountId',
				value: "page.params.localAccountId ?? ''",
				hrefParam: {
					route: 'localAccountId',
					value: 'encodeURIComponent(localAccountId)',
				},
				selector: {
					field: 'localAccountId',
					value: 'decodeURIComponent(localAccountId)',
				},
			},
		],
		id: {
			value: '${instanceOrigin}:${localAccountId}',
		},
	},
	{
		file: 'src/routes/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/(note)/+layout.svelte',
		entity: EntityType.ActivityPubNote,
		component: {
			name: 'ActivityPubNoteView',
		},
		href: {
			path: '/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]',
		},
		params: [
			{
				route: 'instanceOrigin',
				local: 'instanceOrigin',
				value: "page.params.instanceOrigin ?? ''",
				hrefParam: {
					route: 'instanceOrigin',
					value: 'encodeURIComponent(instanceOrigin)',
				},
				selector: {
					field: 'instanceOrigin',
					value: 'decodeURIComponent(instanceOrigin)',
				},
			},
			{
				route: 'localStatusId',
				local: 'localStatusId',
				value: "page.params.localStatusId ?? ''",
				hrefParam: {
					route: 'localStatusId',
					value: 'encodeURIComponent(localStatusId)',
				},
				selector: {
					field: 'localStatusId',
					value: 'decodeURIComponent(localStatusId)',
				},
			},
		],
		id: {
			value: '${instanceOrigin}:${localStatusId}',
		},
	},
] as const satisfies MultiParamEntityParentPageLayoutRoute[]

export const specialParamEntityParentPageLayoutRoutes = [
	{
		file: 'src/routes/(social)/(farcaster)/farcaster/(accounts)/account/[accountId]/(account)/+layout.svelte',
		entity: EntityType.BlockheadFarcasterAccountConnection,
		component: {
			name: 'BlockheadFarcasterAccountConnectionView',
		},
		href: {
			path: '/(social)/(farcaster)/farcaster/(accounts)/account/[accountId]',
		},
		param: {
			route: 'accountId',
			local: 'accountId',
			value: "page.params.accountId ?? ''",
		},
		hrefParam: {
			route: 'accountId',
			value: 'String(accountId)',
		},
		id: {
			value: 'accountId',
		},
		selector: {
			field: 'fid',
			value: 'Number(accountId)',
		},
		view: {
			title: 'Account',
		},
	},
	{
		file: 'src/routes/(social)/(farcaster)/farcaster/(users)/user/[userId=farcasterFid]/(user)/+layout.svelte',
		entity: EntityType.FarcasterUser,
		component: {
			name: 'FarcasterUserView',
		},
		href: {
			path: '/(social)/(farcaster)/farcaster/(users)/user/[userId=farcasterFid]',
		},
		param: {
			route: 'userId',
			local: 'userId',
			value: "page.params.userId ?? ''",
		},
		hrefParam: {
			route: 'userId',
			value: 'String(userId)',
		},
		id: {
			value: 'userId',
		},
		selector: {
			field: 'fid',
			value: 'Number(userId)',
		},
	},
	{
		file: 'src/routes/(social)/(nostr)/nostr/note/[eventId]/(note)/+layout.svelte',
		entity: EntityType.NostrNote,
		component: {
			name: 'NostrNoteView',
		},
		href: {
			path: '/(social)/(nostr)/nostr/note/[eventId]',
		},
		param: {
			route: 'eventId',
			local: 'eventId',
			value: "decodeURIComponent(page.params.eventId ?? '').toLowerCase()",
		},
		hrefParam: {
			route: 'eventId',
			value: 'eventId',
		},
		id: {
			value: 'eventId',
		},
		selector: {
			field: 'eventId',
			value: 'eventId',
		},
	},
	{
		file: 'src/routes/(social)/(nostr)/nostr/profile/[pubkey]/(profile)/+layout.svelte',
		entity: EntityType.NostrProfile,
		component: {
			name: 'NostrProfileView',
		},
		href: {
			path: '/(social)/(nostr)/nostr/profile/[pubkey]',
		},
		param: {
			route: 'pubkey',
			local: 'pubkey',
			value: "page.params.pubkey ?? ''",
		},
		hrefParam: {
			route: 'pubkey',
			value: 'pubkey',
		},
		id: {
			value: 'pubkey',
		},
		selector: {
			field: 'pubkey',
			value: 'pubkey',
		},
	},
	{
		file: 'src/routes/(social)/(reddit)/reddit/r/[name]/(subreddit)/+layout.svelte',
		entity: EntityType.RedditSubreddit,
		component: {
			name: 'RedditSubredditView',
		},
		href: {
			path: '/(social)/(reddit)/reddit/r/[name]',
		},
		param: {
			route: 'name',
			local: 'name',
			value: "page.params.name ?? ''",
		},
		hrefParam: {
			route: 'name',
			value: 'encodeURIComponent(name)',
		},
		id: {
			value: 'name',
		},
		selector: {
			field: 'name',
			value: 'decodeURIComponent(name).toLowerCase()',
		},
	},
	{
		file: 'src/routes/(social)/(rss)/rss/feed/[feedKey]/(feed)/+layout.svelte',
		entity: EntityType.RssFeed,
		component: {
			name: 'RssFeedView',
		},
		href: {
			path: '/(social)/(rss)/rss/feed/[feedKey]',
		},
		param: {
			route: 'feedKey',
			local: 'feedUrl',
			value: "decodeURIComponent(page.params.feedKey ?? '')",
		},
		hrefParam: {
			route: 'feedKey',
			value: 'encodeURIComponent(feedUrl)',
		},
		id: {
			value: 'feedUrl',
		},
		selector: {
			field: 'feedUrl',
			value: 'feedUrl',
		},
	},
] as const satisfies SpecialParamEntityParentPageLayoutRoute[]

export const propsExpressionEntityParentPageLayoutRoutes = [
	{
		file: 'src/routes/(explore)/(ens)/ens/name/[ensName]/(ensName)/+layout.svelte',
		entity: EntityType.EnsName,
		component: {
			name: 'EnsView',
		},
		href: {
			value: "resolve('/(explore)/(ens)/ens/name/[ensName]', params)",
		},
		id: {
			value: 'stringify({ name: params.ensName })',
		},
		selector: {
			value: '{ name: params.ensName }',
		},
		key: {
			value: 'params.ensName',
		},
	},
	{
		file: 'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/+layout.svelte',
		entity: EntityType.EvmNetwork,
		component: {
			name: 'EvmNetworkView',
		},
		imports: [
			"import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'",
		],
		href: {
			value: "resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', params)",
		},
		id: {
			value: 'stringify(eip155NetworkSelectorFromCaip2(params.caip2))',
		},
		selector: {
			value: 'eip155NetworkSelectorFromCaip2(params.caip2)',
		},
		key: {
			value: 'params.caip2',
		},
	},
	{
		file: 'src/routes/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]/(channel)/+layout.svelte',
		entity: EntityType.FarcasterChannel,
		component: {
			name: 'FarcasterChannelView',
		},
		href: {
			value: 'resolve(`/farcaster/channel/${params.channelId}`)',
		},
		id: {
			value: 'params.channelId',
		},
		selector: {
			value: '{ id: params.channelId }',
		},
	},
] as const satisfies PropsExpressionEntityParentPageLayoutRoute[]

export const networkNumericEntityParentPageLayoutRoutes = [
	{
		file: 'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(beacon-epochs)/epoch/[epochNumber=beaconEpochNumber]/(epoch)/+layout.svelte',
		entity: EntityType.BeaconEpoch,
		component: {
			name: 'BeaconEpochView',
		},
		href: {
			path: '/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(beacon-epochs)/epoch/[epochNumber=beaconEpochNumber]',
		},
		selector: {
			local: 'epochEntitySelector',
		},
		value: {
			field: 'epoch',
			route: 'epochNumber',
			value: 'Number(params.epochNumber)',
		},
		asConst: true,
	},
	{
		file: 'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(beacon-slots)/slot/[slotNumber=beaconSlotNumber]/(slot)/+layout.svelte',
		entity: EntityType.BeaconSlot,
		component: {
			name: 'BeaconSlotView',
		},
		href: {
			path: '/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(beacon-slots)/slot/[slotNumber=beaconSlotNumber]',
		},
		selector: {
			local: 'slotEntitySelector',
		},
		value: {
			field: 'slot',
			route: 'slotNumber',
			value: 'Number(params.slotNumber)',
		},
		asConst: true,
	},
	{
		file: 'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]/(block)/+layout.svelte',
		entity: EntityType.EvmBlock,
		component: {
			name: 'EvmBlockView',
		},
		href: {
			path: '/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]',
		},
		selector: {
			local: 'blockEntitySelector',
		},
		value: {
			field: 'blockNumber',
			route: 'blockNumber',
			value: 'BigInt(params.blockNumber)',
		},
	},
] as const satisfies NetworkNumericEntityParentPageLayoutRoute[]

export const routeGroups = [
	{
		id: 'local',
		title: 'Local workspace',
		root: '/~',
		scope: 'local',
		children: [
			'dashboards',
			'accounts',
			'agents',
			'sessions',
			'multiplayer',
			'manage',
		],
	},
	{
		id: 'explore',
		title: 'Explore',
		root: '/explore',
		scope: 'public',
		children: [
			'networks',
			'contracts',
			'ens',
			'services',
			'ipfs',
			'swarm',
			'proposals',
			'upgrades',
			'evm',
		],
	},
	{
		id: 'assets',
		title: 'Assets',
		root: '/assets',
		scope: 'public',
		children: [
			'coins',
			'markets',
			'market-venues',
			'currencies',
			'pools',
			'vaults',
			'leverage',
			'channels',
		],
	},
	{
		id: 'social',
		title: 'Social',
		root: '/social',
		scope: 'public',
		children: [
			'activitypub',
			'atproto',
			'farcaster',
			'lens',
			'nostr',
			'reddit',
			'rss',
			'x',
			'youtube',
			'xmtp',
		],
	},
] as const satisfies RouteGroup[]

export const routes = [
	{
		id: 'home',
		path: '/',
		file: 'src/routes/+page.svelte',
		scope: 'public',
		surface: 'hub',
		navigation: {
			id: 'home',
			title: 'Home',
			hidden: true,
		},
	},
	{
		id: 'explore',
		path: '/explore',
		file: 'src/routes/explore/+page.svelte',
		scope: 'public',
		surface: 'hub',
		entity: {
			entity: EntityType._Global,
			selector: 'scope',
			fields: routeEntityFields.GlobalExplore,
			view: routeEntityViewComponents[EntityType._Global],
		},
		navigation: {
			id: 'explore',
			title: 'Explore',
			icon: '🧭',
			defaultIsOpen: true,
		},
		children: [
			'networks',
			'contracts',
			'ens',
			'services',
			'ipfs',
			'swarm',
			'proposals',
			'upgrades',
			'evm',
		],
	},
	{
		id: 'networks',
		path: '/networks',
		file: 'src/routes/(explore)/networks/+page.svelte',
		scope: 'public',
		surface: 'list',
		entity: {
			entity: EntityType._Global,
			selector: 'scope',
			fields: routeEntityFields.GlobalNetworks,
			view: routeEntityViewComponents[EntityType._Global],
		},
		navigation: {
			id: 'explore-networks',
			title: 'Networks',
			icon: '🌐',
			parent: 'explore',
			defaultIsOpen: true,
		},
		children: [
			'network-eip155',
			'network-slug',
		],
		probe: '/networks',
	},
	{
		id: 'network-eip155',
		path: '/network/[caip2=eip155NetworkCaip2]',
		file: 'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/+layout.svelte',
		scope: 'public',
		surface: 'detail',
		params: [
			routeParams[0],
		],
		entity: {
			entity: EntityType.EvmNetwork,
			selector: 'caip2',
			fields: routeEntityFields.EvmNetworkSummary,
			view: routeEntityViewComponents[EntityType.EvmNetwork],
		},
		tabs: [
			'network-eip155-blocks',
			'network-eip155-transactions',
			'network-eip155-contracts',
			'network-eip155-blobs',
			'network-eip155-beacon-slots',
			'network-eip155-upgrades',
		],
		probe: '/network/eip155:1',
	},
	{
		id: 'network-eip155-blocks',
		path: '/network/[caip2=eip155NetworkCaip2]/blocks',
		file: 'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blocks/+page.svelte',
		scope: 'public',
		surface: 'subview',
		params: [
			routeParams[0],
		],
		entity: {
			entity: EntityType.EvmNetwork,
			selector: 'caip2',
			fields: routeEntityFields.EvmNetworkBlocks,
			view: routeEntityViewComponents[EntityType.EvmNetwork],
		},
		probe: '/network/eip155:1/blocks',
	},
	{
		id: 'network-eip155-block',
		path: '/network/[caip2=eip155NetworkCaip2]/block/[blockNumber=evmBlockNumber]',
		file: 'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]/+page.svelte',
		scope: 'public',
		surface: 'detail',
		params: [
			routeParams[0],
			routeParams[3],
		],
		entity: {
			entity: EntityType.EvmBlock,
			selector: '$network+blockNumber',
			view: routeEntityViewComponents[EntityType.EvmBlock],
		},
		tabs: [
			'network-eip155-block-transactions',
		],
		probe: '/network/eip155:1/block/18000000',
	},
	{
		id: 'network-eip155-transactions',
		path: '/network/[caip2=eip155NetworkCaip2]/transactions',
		file: 'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/transactions/+page.svelte',
		scope: 'public',
		surface: 'subview',
		params: [
			routeParams[0],
		],
		entity: {
			entity: EntityType.EvmNetwork,
			selector: 'caip2',
			fields: routeEntityFields.EvmNetworkTransactions,
			view: routeEntityViewComponents[EntityType.EvmNetwork],
		},
		probe: '/network/eip155:1/transactions',
	},
	{
		id: 'network-eip155-transaction',
		path: '/network/[caip2=eip155NetworkCaip2]/tx/[transactionId=evmTxHash]',
		file: 'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/+page.svelte',
		scope: 'public',
		surface: 'detail',
		params: [
			routeParams[0],
			routeParams[4],
		],
		entity: {
			entity: EntityType.EvmTransaction,
			selector: '$network+hash',
			view: routeEntityViewComponents[EntityType.EvmTransaction],
		},
		tabs: [
			'network-eip155-transaction-log',
		],
		probe: '/network/eip155:1/tx/0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
	},
	{
		id: 'network-eip155-transaction-log',
		path: '/network/[caip2=eip155NetworkCaip2]/tx/[transactionId=evmTxHash]/log/[logIndex=nonNegativeInteger]',
		file: 'src/routes/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/log/[logIndex=nonNegativeInteger]/+page.svelte',
		scope: 'public',
		surface: 'detail',
		params: [
			routeParams[0],
			routeParams[4],
			routeParams[5],
		],
		entity: {
			entity: EntityType.EvmLog,
			selector: '$transaction+logIndex',
			view: routeEntityViewComponents[EntityType.EvmLog],
		},
		probe: '/network/eip155:1/tx/0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca/log/0',
	},
	{
		id: 'network-slug',
		path: '/network/[networkSlug=networkSlug]',
		file: 'src/routes/(explore)/(networks)/network/[networkSlug=networkSlug]/+page.svelte',
		scope: 'public',
		surface: 'detail',
		params: [
			routeParams[1],
		],
		entity: {
			entity: EntityType.Network,
			selector: 'slug',
			view: routeEntityViewComponents[EntityType.Network],
		},
		probe: '/network/bitcoin',
		notes: 'Legacy/non-EVM network detail family; scripts should preserve it separately from CAIP-2 EVM routes.',
	},
	{
		id: 'assets',
		path: '/assets',
		file: 'src/routes/assets/+page.svelte',
		scope: 'public',
		surface: 'hub',
		entity: {
			entity: EntityType._Global,
			selector: 'scope',
			fields: routeEntityFields.GlobalAssets,
			view: routeEntityViewComponents[EntityType._Global],
		},
		navigation: {
			id: 'assets',
			title: 'Assets',
			icon: '💼',
			defaultIsOpen: true,
		},
		children: [
			'coins',
			'markets',
			'market-venues',
			'currencies',
			'pools',
			'vaults',
			'leverage',
			'channels',
		],
	},
	{
		id: 'coins',
		path: '/coins',
		file: 'src/routes/(assets)/coins/+page.svelte',
		scope: 'public',
		surface: 'list',
		entity: {
			entity: EntityType._Global,
			selector: 'scope',
			fields: [
				'$$coins',
				'$$marketQuotes',
			],
			view: routeEntityViewComponents[EntityType._Global],
		},
		navigation: {
			id: 'assets-coins',
			title: 'Coins',
			icon: '🪙',
			parent: 'assets',
			defaultIsOpen: true,
		},
		children: [
			'coins-prices',
			'coins-candles',
			'coin',
		],
		probe: '/coins',
	},
	{
		id: 'coin',
		path: '/coin/[coinId]',
		file: 'src/routes/(assets)/(coins)/coin/[coinId]/+page.svelte',
		scope: 'public',
		surface: 'detail',
		params: [
			routeParams[7],
		],
		entity: {
			entity: EntityType.Coin,
			selector: 'id',
			view: routeEntityViewComponents[EntityType.Coin],
		},
		probe: '/coin/ETH',
	},
	{
		id: 'markets',
		path: '/markets',
		file: 'src/routes/(assets)/markets/+page.svelte',
		scope: 'public',
		surface: 'list',
		entity: {
			entity: EntityType._Global,
			selector: 'scope',
			fields: [
				'$$markets',
			],
			view: routeEntityViewComponents[EntityType._Global],
		},
		navigation: {
			id: 'assets-markets',
			title: 'Markets',
			icon: '🔀',
			parent: 'assets',
		},
		children: [
			'market',
		],
		probe: '/markets',
	},
	{
		id: 'market',
		path: '/market/[marketKey]',
		file: 'src/routes/(assets)/(markets)/market/[marketKey]/+page.svelte',
		scope: 'public',
		surface: 'detail',
		params: [
			routeParams[8],
		],
		entity: {
			entity: EntityType.Market,
			selector: 'marketKey',
			view: routeEntityViewComponents[EntityType.Market],
		},
		probe: '/market/%5Bdevalue%20Market%20selector%5D',
	},
	{
		id: 'pools',
		path: '/pools',
		file: 'src/routes/(assets)/pools/+page.svelte',
		scope: 'public',
		surface: 'list',
		entity: {
			entity: EntityType._Global,
			selector: 'scope',
			fields: [
				'$$liquidityPools',
			],
			view: routeEntityViewComponents[EntityType._Global],
		},
		navigation: {
			id: 'assets-pools',
			title: 'Pools',
			icon: '🌊',
			parent: 'assets',
		},
		children: [
			'pool',
		],
		probe: '/pools',
	},
	{
		id: 'pool',
		path: '/pool/[chainId=eip155ChainId]/[poolId]',
		file: 'src/routes/(assets)/(pools)/pool/[chainId=eip155ChainId]/[poolId]/+page.svelte',
		scope: 'public',
		surface: 'detail',
		params: [
			routeParams[9],
			routeParams[10],
		],
		entity: {
			entity: EntityType.LiquidityPool,
			selector: 'chainId+poolId',
			view: routeEntityViewComponents[EntityType.LiquidityPool],
		},
		probe: '/pool/1/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
	},
	{
		id: 'evm',
		path: '/evm',
		file: 'src/routes/(explore)/evm/+page.svelte',
		scope: 'public',
		surface: 'hub',
		entity: {
			entity: EntityType._GlobalEvmAbiCatalog,
			selector: 'scope',
			fields: [
				'$$sourceWindowSelectors',
				'$$sourceWindowTopics',
				'$$sourceWindowErrors',
			],
			view: routeEntityViewComponents[EntityType._GlobalEvmAbiCatalog],
		},
		navigation: {
			id: 'explore-evm',
			title: 'EVM',
			icon: '🛠️',
			parent: 'explore',
		},
		children: [
			'evm-calldata',
			'evm-calldata-decoder',
			'evm-selectors',
			'evm-topics',
			'evm-errors',
		],
		probe: '/evm',
	},
	{
		id: 'ens',
		path: '/ens',
		file: 'src/routes/(explore)/ens/+page.svelte',
		scope: 'public',
		surface: 'hub',
		entity: {
			entity: EntityType._GlobalEnsNetwork,
			selector: 'scope',
			fields: [
				'$$timestamps',
				'$registryContract',
				'$ethRegistrarController',
				'$reverseRegistrar',
				'$nameWrapper',
			],
			view: routeEntityViewComponents[EntityType._GlobalEnsNetwork],
		},
		navigation: {
			id: 'explore-ens',
			title: 'ENS',
			icon: '🪪',
			parent: 'explore',
		},
		children: [
			'ens-name',
		],
		probe: '/ens',
	},
	{
		id: 'ens-name',
		path: '/ens/name/[ensName]',
		file: 'src/routes/(explore)/(ens)/ens/name/[ensName]/+page.svelte',
		scope: 'public',
		surface: 'detail',
		params: [
			routeParams[12],
		],
		entity: {
			entity: EntityType.EnsName,
			selector: 'name',
			view: routeEntityViewComponents[EntityType.EnsName],
		},
		tabs: [
			'ens-name-records',
			'ens-name-resolver',
			'ens-name-resolves-to',
		],
		probe: '/ens/name/vitalik.eth',
	},
	{
		id: 'proposals',
		path: '/proposals',
		file: 'src/routes/(explore)/proposals/+page.svelte',
		scope: 'public',
		surface: 'list',
		entity: {
			entity: EntityType._Global,
			selector: 'scope',
			fields: [
				'$$proposals',
				'proposalRealms',
				'proposalCategories',
			],
			view: routeEntityViewComponents[EntityType._Global],
		},
		navigation: {
			id: 'explore-proposals',
			title: 'Proposals',
			icon: '🗳️',
			parent: 'explore',
			defaultIsOpen: true,
		},
		children: [
			'proposal-realm',
		],
		probe: '/proposals',
	},
	{
		id: 'proposal-realm',
		path: '/proposals/[specificationRealmSlug=specificationRealmSlug]',
		file: 'src/routes/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/+page.svelte',
		scope: 'public',
		surface: 'list',
		params: [
			routeParams[13],
		],
		entity: {
			entity: EntityType.SpecificationProposal,
			sourceWindow: 'realm',
			view: routeEntityViewComponents[EntityType.SpecificationProposal],
		},
		children: [
			'proposal-kind',
		],
		probe: '/proposals/ethereum',
	},
	{
		id: 'proposal-kind',
		path: '/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]',
		file: 'src/routes/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/+page.svelte',
		scope: 'public',
		surface: 'list',
		params: [
			routeParams[13],
			routeParams[14],
		],
		entity: {
			entity: EntityType.SpecificationProposal,
			sourceWindow: 'realm+kind',
			view: routeEntityViewComponents[EntityType.SpecificationProposal],
		},
		children: [
			'proposal',
		],
		probe: '/proposals/ethereum/eip',
	},
	{
		id: 'proposal',
		path: '/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]/[proposalRef=proposalRef]',
		file: 'src/routes/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(proposalKind)/[proposalRef=proposalRef]/+page.svelte',
		scope: 'public',
		surface: 'detail',
		params: [
			routeParams[13],
			routeParams[14],
			routeParams[15],
		],
		entity: {
			entity: EntityType.SpecificationProposal,
			selector: 'realm+kind+ref',
			view: routeEntityViewComponents[EntityType.SpecificationProposal],
		},
		probe: '/proposals/ethereum/eip/eip-1559',
	},
	{
		id: 'social',
		path: '/social',
		file: 'src/routes/social/+page.svelte',
		scope: 'public',
		surface: 'hub',
		entity: {
			entity: EntityType._Global,
			selector: 'scope',
			fields: [
				'$$actors',
			],
			view: routeEntityViewComponents[EntityType._Global],
		},
		navigation: {
			id: 'social',
			title: 'Social',
			icon: '👥',
			defaultIsOpen: true,
		},
		children: [
			'activitypub',
			'atproto',
			'farcaster',
			'lens',
			'nostr',
			'reddit',
			'rss',
			'x',
			'youtube',
			'xmtp',
		],
	},
	{
		id: 'farcaster',
		path: '/farcaster',
		file: 'src/routes/(social)/farcaster/+page.svelte',
		scope: 'public',
		surface: 'hub',
		entity: {
			entity: EntityType._GlobalFarcasterNetwork,
			selector: 'scope',
			fields: [
				'$$sourceWindowUsers',
				'$$sourceWindowChannels',
				'$$sourceWindowCasts',
				'$$sourceWindowFeeds',
			],
			view: routeEntityViewComponents[EntityType._GlobalFarcasterNetwork],
		},
		navigation: {
			id: 'social-farcaster',
			title: 'Farcaster',
			icon: '🏛️',
			parent: 'social',
		},
		children: [
			'farcaster-accounts',
			'farcaster-feed',
			'farcaster-channels',
			'farcaster-users',
		],
		probe: '/farcaster',
	},
	{
		id: 'youtube',
		path: '/youtube',
		file: 'src/routes/(social)/youtube/+page.svelte',
		scope: 'public',
		surface: 'hub',
		entity: {
			entity: EntityType._GlobalYouTubeNetwork,
			selector: 'scope',
			fields: [
				'$$sourceWindowChannels',
				'$$sourceWindowVideos',
				'$$sourceWindowPlaylists',
			],
			view: routeEntityViewComponents[EntityType._GlobalYouTubeNetwork],
		},
		navigation: {
			id: 'social-youtube',
			title: 'YouTube',
			icon: '▶️',
			parent: 'social',
		},
		children: [
			'youtube-channels',
			'youtube-videos',
			'youtube-playlists',
		],
		probe: '/youtube',
	},
	{
		id: 'accounts',
		path: '/~/accounts',
		file: 'src/routes/~/accounts/+page.svelte',
		scope: 'local',
		surface: 'hub',
		entity: {
			entity: EntityType._Global,
			selector: 'scope',
			fields: [
				'$$blockheadWallets',
				'$$blockheadWalletConnections',
				'$$blockheadWalletAccounts',
				'$$liquidityPositions',
				'$$bridgeTransfers',
			],
			view: routeEntityViewComponents[EntityType._Global],
		},
		navigation: {
			id: 'local-accounts',
			title: 'Accounts',
			icon: '🔑',
			defaultIsOpen: true,
		},
		children: [
			'accounts-connections',
			'accounts-watched-accounts',
			'accounts-balances',
			'accounts-allowances',
			'accounts-positions',
			'accounts-transactions',
		],
		probe: '/~/accounts',
	},
	{
		id: 'agents',
		path: '/~/agents',
		file: 'src/routes/~/agents/+page.svelte',
		scope: 'local',
		surface: 'hub',
		entity: {
			entity: EntityType._Global,
			selector: 'scope',
			fields: [
				'$$blockheadAgentConversations',
				'$$aiModelCatalogs',
				'$$aiArtifactCatalogs',
				'$$agentNetworks',
			],
			view: routeEntityViewComponents[EntityType._Global],
		},
		navigation: {
			id: 'agents',
			title: 'Agents',
			icon: '🤖',
			defaultIsOpen: true,
		},
		children: [
			'agents-conversations',
			'agent-conversation',
		],
		probe: '/~/agents',
	},
] as const satisfies RoutePattern[]

export const routeGenerationTargets = [
	{
		path: 'src/routes/navigationItems.svelte.ts',
		from: 'routes[].navigation',
		notes: 'Generate the tree by parent ids, preserving explicit `children` order from route groups and route records.',
	},
	{
		path: 'tests/e2e/routeViewSmokePaths.ts',
		from: 'routes[].probe',
		notes: 'Generate stable smoke labels from route ids; scripts may override probes whose fixtures require imported constants.',
	},
	{
		path: 'tests/e2e/_routeParamFixtures.ts',
		from: 'routeParams',
		notes: 'Generate simple scalar defaults, leaving source-backed fixture constants in a manual overlay.',
	},
	{
		path: 'SCHEMA.md View :: route metadata',
		from: 'routes[].entity',
		notes: 'Schema view tabs and route tabs should agree on entity boundaries without making nav groups into schema relations.',
	},
] as const

export const routeCompletenessAudit = {
	currentRouteTree: {
		pageSvelteFiles: 224,
		layoutSvelteFiles: 106,
		routeModuleFiles: 25,
	},
	currentDraft: {
		status: 'partial-format-with-file-and-family-models',
		routeRecords: routes.length,
		routeFileRecords: routeFiles.length,
		routeFamilyRecords: routeFamilies.length,
	},
	missingForRouteFileGeneration: [
		{
			id: 'layout-shells',
			description: 'Represent every +layout.svelte, including ParentPageCollapsible href/id/summary selection and grouped layout inheritance.',
			examples: [
				'src/routes/(explore)/(ens)/ens/name/[ensName]/(ensName)/+layout.svelte',
				'src/routes/(social)/(youtube)/+layout.svelte',
				'src/routes/~/(agents)/agents/(conversations)/conversation/[conversationId]/(conversation)/+layout.svelte',
			],
		},
		{
			id: 'route-modules',
			description: 'Represent +page.ts/+layout.ts/+server.ts load behavior, data dependencies, parsing, validation, and error paths.',
			examples: [
				'src/routes/bridge/route/[routeId]/+page.ts',
				'src/routes/url/[url]/+page.ts',
				'src/routes/(social)/(rss)/rss/feed/[feedKey]/+page.ts',
			],
		},
		{
			id: 'selection-builders',
			description: 'Model selector expressions, source hints, params transforms, constants lookups, devalue parsing/stringifying, and conditional selectors.',
			examples: [
				'networkSelectorFromCaip2(params.caip2)',
				'specificationRealmBySlug[params.specificationRealmSlug]',
				'params.reference.toLowerCase().replace(...)',
			],
		},
		{
			id: 'boundary-patterns',
			description: 'Represent ResourceBoundary usage, parent resource preloads, and branches that render different entity views based on loaded parent data.',
			examples: [
				'Lightning channel routes under networkSlug',
				'UTXO/EVM address split under networkSlug',
				'EVM calldata decoder linked selector/topic lookups',
			],
		},
		{
			id: 'all-route-families',
			description: 'Expand beyond the seed routes to all assets, EVM, ENS, services, IPFS, Swarm, social, bridge, local workspace, demo, test, and API routes.',
			examples: [
				'224 +page.svelte routes',
				'106 +layout.svelte routes',
				'25 route module files',
			],
		},
		{
			id: 'page-composition',
			description: 'Represent non-generic page composition: multiple views per page, CollapsibleTabs, custom forms/tools, lists with href builders, and inline snippets.',
			examples: [
				'src/routes/explore/+page.svelte',
				'src/routes/assets/+page.svelte',
				'src/routes/(explore)/(evm)/evm/calldata-decoder/+page.svelte',
			],
		},
		{
			id: 'test-and-e2e-metadata',
			description: 'Represent routes that exist only for tests/demos and preserve probe fixtures without promoting them into product navigation.',
			examples: [
				'src/routes/test/resource-boundary/+page.svelte',
				'src/routes/test/query-resource-adapter/getters/+page.svelte',
				'src/routes/demo/list-view-transitions/+page.svelte',
			],
		},
	],
	nextFormatChanges: [
		'Expand routeFiles until every discovered +page.svelte, +layout.svelte, +page.ts, +layout.ts, and +server.ts has a record.',
		'Promote common selection transforms such as networkSelectorFromCaip2, decodeURIComponent, with0xHex, and devalue selector parsing into named reusable builders.',
		'Add import manifests for every component/load declaration so generation can reproduce script sections deterministically.',
		'Add component composition declarations for CollapsibleTabs, inline href lists, form/tool pages, and route-local snippets.',
		'Generate and diff against discovered routes before attempting any file writes.',
	],
} as const
