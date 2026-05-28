import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { SpecificationRealm } from '$/constants/SpecificationProposal.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.SpecificationRealm,

	label: 'Specification realm',
	labelPlural: 'Specification realms',

	id: type({
		realm: type.valueOf(SpecificationRealm),
	}),

	fields: [
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'labelPlural',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slug',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$proposalKinds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SpecificationProposalKind,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SpecificationProposal,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
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
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
