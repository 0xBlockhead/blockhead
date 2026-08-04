/**
 * Compound III deployment artifact operations (official comet repo).
 * @see https://docs.compound.finance/
 * @see https://github.com/compound-finance/comet/tree/main/deployments
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Compound/bindings.ts'
import type {
	CompoundCometConfiguration,
	CompoundCometConfigurationWire,
	CompoundCometRoots,
	CompoundCometRootsWire,
} from '$/sources/Compound/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const binding = bindings[Source.Compound_Rest][0]

const assertCometAddress = (cometAddress: string) => {
	const normalized = hexLowerOfByteSize(cometAddress, 20)
	if (normalized == null)
		throw new Error(`${Source.Compound_Rest}: invalid comet address ${cometAddress}`)
	return normalized
}

const assertAddress = (
	value: string,
	label: string
) => {
	const normalized = hexLowerOfByteSize(value, 20)
	if (normalized == null)
		throw new Error(`${Source.Compound_Rest}: invalid ${label} ${value}`)
	return normalized
}

const assertNonEmptyString = (
	value: string,
	label: string
) => {
	if (value.length < 1)
		throw new Error(`${Source.Compound_Rest}: configuration missing ${label}`)
	return value
}

const deploymentPath = (
	networkSlug: string,
	marketSlug: string,
	fileName: 'configuration.json' | 'roots.json'
) => (
	`deployments/${networkSlug}/${marketSlug}/${fileName}`
)

const assertConfigurationWire = (
	wire: CompoundCometConfigurationWire
): CompoundCometConfiguration => {
	const assetEntries = Object.entries(wire.assets)
	if (assetEntries.length < 1)
		throw new Error(`${Source.Compound_Rest}: configuration missing collateral assets`)

	for (const [
		symbol,
		asset,
	] of assetEntries) {
		if (symbol.length < 1)
			throw new Error(`${Source.Compound_Rest}: configuration asset missing symbol`)
		assertAddress(asset.address, `${symbol} address`)
		assertAddress(asset.priceFeed, `${symbol} price feed`)
		if (asset.decimals.length < 1)
			throw new Error(`${Source.Compound_Rest}: configuration asset ${symbol} missing decimals`)
		if (asset.supplyCap.length < 1)
			throw new Error(`${Source.Compound_Rest}: configuration asset ${symbol} missing supplyCap`)
	}

	return {
		name: assertNonEmptyString(wire.name, 'name'),
		symbol: assertNonEmptyString(wire.symbol, 'symbol'),
		baseTokenSymbol: assertNonEmptyString(wire.baseToken, 'baseToken'),
		baseTokenAddress: assertAddress(wire.baseTokenAddress, 'baseTokenAddress'),
		baseTokenPriceFeedAddress: assertAddress(wire.baseTokenPriceFeed, 'baseTokenPriceFeed'),
		...(wire.borrowMin != null && {
			borrowMin: assertNonEmptyString(wire.borrowMin, 'borrowMin'),
		}),
		...(wire.governor != null && {
			governorAddress: assertAddress(wire.governor, 'governor'),
		}),
		...(wire.pauseGuardian != null && {
			pauseGuardianAddress: assertAddress(wire.pauseGuardian, 'pauseGuardian'),
		}),
		...(wire.storeFrontPriceFactor != null && {
			storeFrontPriceFactor: wire.storeFrontPriceFactor,
		}),
		...(wire.targetReserves != null && {
			targetReserves: assertNonEmptyString(wire.targetReserves, 'targetReserves'),
		}),
		...(wire.rewardTokenAddress != null && {
			rewardTokenAddress: assertAddress(wire.rewardTokenAddress, 'rewardTokenAddress'),
		}),
		collateralAssetCount: assetEntries.length,
	}
}

const assertRootsWire = (
	wire: CompoundCometRootsWire,
	expectedCometAddress: `0x${string}`
): CompoundCometRoots => {
	const cometAddress = assertCometAddress(wire.comet)
	if (cometAddress !== expectedCometAddress)
		throw new Error(`${Source.Compound_Rest}: roots comet address mismatch`)

	return {
		cometAddress,
		...(wire.configurator != null && {
			configuratorAddress: assertAddress(wire.configurator, 'configurator'),
		}),
		...(wire.rewards != null && {
			rewardsAddress: assertAddress(wire.rewards, 'rewards'),
		}),
		...(wire.bulker != null && {
			bulkerAddress: assertAddress(wire.bulker, 'bulker'),
		}),
	}
}

/** Fetch official `configuration.json` for one Comet deployment folder. */
export const getConfiguration = async ({
	networkSlug,
	marketSlug,
}: {
	networkSlug: string
	marketSlug: string
}) => {
	if (networkSlug.length < 1)
		throw new Error(`${Source.Compound_Rest}: networkSlug required`)
	if (marketSlug.length < 1)
		throw new Error(`${Source.Compound_Rest}: marketSlug required`)

	const wire = await sourceGetJson<CompoundCometConfigurationWire>(
		binding,
		httpUrl(binding, deploymentPath(networkSlug, marketSlug, 'configuration.json'))
	)
	if (wire == null)
		throw new Error(`${Source.Compound_Rest}: configuration response missing data`)

	return assertConfigurationWire(wire)
}

/** Fetch official `roots.json` for one Comet deployment folder. */
export const getRoots = async ({
	networkSlug,
	marketSlug,
	expectedCometAddress,
}: {
	networkSlug: string
	marketSlug: string
	expectedCometAddress: string
}) => {
	if (networkSlug.length < 1)
		throw new Error(`${Source.Compound_Rest}: networkSlug required`)
	if (marketSlug.length < 1)
		throw new Error(`${Source.Compound_Rest}: marketSlug required`)

	const normalizedCometAddress = assertCometAddress(expectedCometAddress)
	const wire = await sourceGetJson<CompoundCometRootsWire>(
		binding,
		httpUrl(binding, deploymentPath(networkSlug, marketSlug, 'roots.json'))
	)
	if (wire == null)
		throw new Error(`${Source.Compound_Rest}: roots response missing data`)

	return assertRootsWire(wire, normalizedCometAddress)
}
