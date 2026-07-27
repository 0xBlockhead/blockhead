// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'

export default ({
	realm,
	category,
}: {
	realm?: 'Bitcoin' | 'BitcoinCash' | 'ChainAgnostic' | 'Cosmos' | 'Dogecoin' | 'Ens' | 'Ethereum' | 'Filecoin' | 'Hyperliquid' | 'Litecoin' | 'Near' | 'Polkadot' | 'Quilibrium' | 'Solana' | 'Zcash'
	category?: 'Bip' | 'Chip' | 'Caip' | 'Adr' | 'Dip' | 'Ensip' | 'Eip' | 'Erc' | 'Fip' | 'Hip' | 'Lip' | 'Nep' | 'Rfc' | 'ProtocolDocument' | 'Simd' | 'Zip'
}) => {
	if (realm === 'Bitcoin' && category === 'Bip')
		return [Source.BitcoinBips_Github]

	if (realm === 'BitcoinCash' && category === 'Chip')
		return [Source.BitcoinCashChips_Gitlab]

	if (realm === 'ChainAgnostic' && category === 'Caip')
		return [Source.Caips_Github]

	if (realm === 'Cosmos' && category === 'Adr')
		return [Source.CosmosAdrs_Github]

	if (realm === 'Dogecoin' && category === 'Dip')
		return [Source.DogecoinDips_Github]

	if (realm === 'Ens' && category === 'Ensip')
		return [Source.Ensips_Github]

	if (realm === 'Ethereum' && category === 'Eip')
		return [Source.EthereumEips_Github]

	if (realm === 'Ethereum' && category === 'Erc')
		return [Source.EthereumEips_Github]

	if (realm === 'Filecoin' && category === 'Fip')
		return [Source.FilecoinFips_Github]

	if (realm === 'Hyperliquid' && category === 'Hip')
		return [Source.HyperliquidDocs_Rest]

	if (realm === 'Litecoin' && category === 'Lip')
		return [Source.LitecoinLips_Github]

	if (realm === 'Near' && category === 'Nep')
		return [Source.NearNeps_Github]

	if (realm === 'Polkadot' && category === 'Rfc')
		return [Source.PolkadotRfcs_Github]

	if (realm === 'Quilibrium' && category === 'ProtocolDocument')
		return [Source.QuilibriumDocs_Rest]

	if (realm === 'Solana' && category === 'Simd')
		return [Source.SolanaSimds_Github]

	if (realm === 'Zcash' && category === 'Zip')
		return [Source.ZcashZips_Github]

	return [
		Source.BitcoinBips_Github,
		Source.BitcoinCashChips_Gitlab,
		Source.Caips_Github,
		Source.CosmosAdrs_Github,
		Source.DogecoinDips_Github,
		Source.Ensips_Github,
		Source.EthereumEips_Github,
		Source.FilecoinFips_Github,
		Source.HyperliquidDocs_Rest,
		Source.LitecoinLips_Github,
		Source.NearNeps_Github,
		Source.PolkadotRfcs_Github,
		Source.QuilibriumDocs_Rest,
		Source.SolanaSimds_Github,
		Source.ZcashZips_Github,
	]
}
