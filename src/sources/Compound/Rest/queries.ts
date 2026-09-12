/**
 * Compound III deployment artifact operations (official comet repo).
 * Interest-rate curve params come from `configuration.json` `rates`
 * (kink + piecewise slopes/base). Live utilization / supply+borrow rates
 * require on-chain `getUtilization` / `getSupplyRate` / `getBorrowRate`.
 * @see https://docs.compound.finance/interest-rates/
 * @see https://docs.compound.finance/helper-functions/#get-protocol-configuration
 * @see https://github.com/compound-finance/comet/tree/f766f51583c23acc33b2a7824654ef2029a96804/deployments
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Compound/bindings.ts'
import type {
	CompoundCometConfiguration,
	CompoundCometConfigurationAsset,
	CompoundCometConfigurationAssetWire,
	CompoundCometConfigurationWire,
	CompoundCometRates,
	CompoundCometRatesWire,
	CompoundCometRoots,
	CompoundCometRootsWire,
} from '$/sources/Compound/Rest/types.ts'
import {
	compoundCometConfigurationEnvelope,
	compoundCometRootsEnvelope,
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

const assertDeploymentSlug = (
	value: string,
	label: string
) => {
	if (value.length < 1)
		throw new Error(`${Source.Compound_Rest}: ${label === 'network slug' ? 'networkSlug' : 'marketSlug'} required`)
	if (
		value.length > 128
		|| value !== value.trim()
		|| /[\\/\u0000-\u001f\u007f]/.test(value)
	)
		throw new Error(`${Source.Compound_Rest}: invalid ${label}`)
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

/** Official Comet config amounts use decimal or scientific forms (`1e0`, `5000000e6`). */
const compoundAmountPattern = /^(?:0|[1-9](?:_?\d)*)(?:\.\d(?:_?\d)*)?(?:e\d(?:_?\d)*)?$/i

const assertCompoundAmountString = (
	value: string,
	label: string
) => {
	const normalized = assertNonEmptyString(value, label)
	if (!compoundAmountPattern.test(normalized))
		throw new Error(`${Source.Compound_Rest}: configuration ${label} must be a non-negative decimal or scientific amount`)
	return normalized.replaceAll('_', '')
}

const assertEnvelope = (
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`${Source.Compound_Rest}: invalid ${label} response envelope`)
	}
}

const deploymentPath = (
	networkSlug: string,
	marketSlug: string,
	fileName: 'configuration.json' | 'roots.json'
) => (
	`deployments/${networkSlug}/${marketSlug}/${fileName}`
)

const assertConfigurationAssetWire = (
	symbol: string,
	asset: CompoundCometConfigurationAssetWire
): CompoundCometConfigurationAsset => {
	if (symbol.length < 1)
		throw new Error(`${Source.Compound_Rest}: configuration asset missing symbol`)

	const decimals = Number(asset.decimals)
	if (!Number.isSafeInteger(decimals) || decimals < 0)
		throw new Error(`${Source.Compound_Rest}: configuration asset ${symbol} missing decimals`)

	const assertCollateralFactor = (
		value: number,
		label: string
	) => {
		if (!Number.isFinite(value) || value < 0 || value > 1)
			throw new Error(`${Source.Compound_Rest}: configuration asset ${symbol} ${label} must be a finite number in [0, 1]`)
		return value
	}

	return {
		symbol,
		tokenAddress: assertAddress(asset.address, `${symbol} address`),
		...(asset.priceFeed != null && {
			priceFeedAddress: assertAddress(asset.priceFeed, `${symbol} price feed`),
		}),
		decimals,
		borrowCF: assertCollateralFactor(asset.borrowCF, 'borrowCF'),
		liquidateCF: assertCollateralFactor(asset.liquidateCF, 'liquidateCF'),
		liquidationFactor: assertCollateralFactor(asset.liquidationFactor, 'liquidationFactor'),
		supplyCap: assertCompoundAmountString(asset.supplyCap, `${symbol} supplyCap`),
	}
}

const assertFiniteRate = (
	value: number,
	label: string
) => {
	if (!Number.isFinite(value) || value < 0)
		throw new Error(`${Source.Compound_Rest}: configuration rates.${label} must be a finite non-negative number`)
	return value
}

const assertKinkRate = (
	value: number,
	label: string
) => {
	if (!Number.isFinite(value) || value < 0 || value > 1)
		throw new Error(`${Source.Compound_Rest}: configuration rates.${label} must be a finite number in [0, 1]`)
	return value
}

/** Assert official `rates` curve params (required on cataloged Comet configs). */
const assertRatesWire = (
	rates: CompoundCometRatesWire
): CompoundCometRates => ({
	supplyKink: assertKinkRate(rates.supplyKink, 'supplyKink'),
	supplySlopeLow: assertFiniteRate(rates.supplySlopeLow, 'supplySlopeLow'),
	supplySlopeHigh: assertFiniteRate(rates.supplySlopeHigh, 'supplySlopeHigh'),
	supplyBase: assertFiniteRate(rates.supplyBase, 'supplyBase'),
	borrowKink: assertKinkRate(rates.borrowKink, 'borrowKink'),
	borrowSlopeLow: assertFiniteRate(rates.borrowSlopeLow, 'borrowSlopeLow'),
	borrowSlopeHigh: assertFiniteRate(rates.borrowSlopeHigh, 'borrowSlopeHigh'),
	borrowBase: assertFiniteRate(rates.borrowBase, 'borrowBase'),
})

const assertConfigurationWire = (
	wire: CompoundCometConfigurationWire
): CompoundCometConfiguration => {
	const assets = (
		Object.entries(wire.assets)
			.map(([
				symbol,
				asset,
			]) => (
				assertConfigurationAssetWire(symbol, asset)
			))
			.sort((left, right) => (
				left.symbol.localeCompare(right.symbol)
			))
	)
	const baseTokenAddress = assertAddress(wire.baseTokenAddress, 'baseTokenAddress')
	if (new Set(assets.map((asset) => asset.tokenAddress)).size !== assets.length)
		throw new Error(`${Source.Compound_Rest}: configuration has duplicate collateral asset identity`)
	if (assets.some((asset) => asset.tokenAddress === baseTokenAddress))
		throw new Error(`${Source.Compound_Rest}: base token cannot also be a collateral asset`)

	if (wire.storeFrontPriceFactor != null && (!Number.isFinite(wire.storeFrontPriceFactor) || wire.storeFrontPriceFactor < 0 || wire.storeFrontPriceFactor > 1))
		throw new Error(`${Source.Compound_Rest}: configuration storeFrontPriceFactor must be a finite number in [0, 1]`)

	return {
		name: assertNonEmptyString(wire.name, 'name'),
		symbol: assertNonEmptyString(wire.symbol, 'symbol'),
		baseTokenSymbol: assertNonEmptyString(wire.baseToken, 'baseToken'),
		baseTokenAddress,
		...(wire.baseTokenPriceFeed != null && {
			baseTokenPriceFeedAddress: assertAddress(wire.baseTokenPriceFeed, 'baseTokenPriceFeed'),
		}),
		...(wire.borrowMin != null && {
			borrowMin: assertCompoundAmountString(wire.borrowMin, 'borrowMin'),
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
			targetReserves: assertCompoundAmountString(wire.targetReserves, 'targetReserves'),
		}),
		...(wire.rewardTokenAddress != null && {
			rewardTokenAddress: assertAddress(wire.rewardTokenAddress, 'rewardTokenAddress'),
		}),
		rates: assertRatesWire(wire.rates),
		collateralAssetCount: assets.length,
		assets,
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
	assertDeploymentSlug(networkSlug, 'network slug')
	assertDeploymentSlug(marketSlug, 'market slug')

	const wire = await sourceGetJson<CompoundCometConfigurationWire | undefined>(
		binding,
		httpUrl(binding, deploymentPath(networkSlug, marketSlug, 'configuration.json'))
	)
	if (wire == null)
		throw new Error(`${Source.Compound_Rest}: configuration response missing data`)
	assertEnvelope(compoundCometConfigurationEnvelope, wire, 'configuration')

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
	assertDeploymentSlug(networkSlug, 'network slug')
	assertDeploymentSlug(marketSlug, 'market slug')

	const normalizedCometAddress = assertCometAddress(expectedCometAddress)
	const wire = await sourceGetJson<CompoundCometRootsWire | undefined>(
		binding,
		httpUrl(binding, deploymentPath(networkSlug, marketSlug, 'roots.json'))
	)
	if (wire == null)
		throw new Error(`${Source.Compound_Rest}: roots response missing data`)
	assertEnvelope(compoundCometRootsEnvelope, wire, 'roots')

	return assertRootsWire(wire, normalizedCometAddress)
}
