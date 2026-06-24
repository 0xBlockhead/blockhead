<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		{
			label: 'attestation',
		},
		{
			label: 'observation time',
		},
		{
			label: 'valid/revoked',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'attestation',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'valid flag',
				},
				{
					label: 'revoked flag',
				},
				{
					label: 'expired flag',
				},
				{
					label: 'revocation time',
				},
			],
			[
				{
					label: 'attest transaction/log',
				},
				{
					label: 'revoked transaction/log',
				},
				{
					label: 'block number',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Attestation',
				items: [
					{
						label: 'parent EAS attestation',
					},
				],
			},
			{
				label: 'Lifecycle evidence',
				items: [
					{
						label: 'Attested and Revoked event coordinates',
					},
				],
			},
			{
				label: 'Contract reads',
				items: [
					{
						label: 'isAttestationValid/getAttestation response at source block',
					},
				],
			},
			{
				label: 'Indexer evidence',
				items: [
					{
						label: 'EAS Scan or explorer payload freshness',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EasAttestation_Timestamp>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.EasAttestation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
