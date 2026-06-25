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
		'uid',
		'$schema',
		{
			label: 'recipient/attester',
		},
	],
	content: {
		dl: [
			[
				'uid',
				'$network',
				'schemaUid',
				'recipient',
				'attester',
			],
			[
				'refUid',
				{
					label: 'attested time',
				},
				'expirationTime',
				'revocable',
				{
					label: 'latest revocation/validity status',
				},
			],
			[
				{
					label: 'data byte length',
				},
				{
					label: 'schema resolver',
				},
				{
					label: 'source transaction/log',
				},
				{
					label: 'linked recipient/attester accounts',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Schema',
				items: [
					{
						label: 'parent EAS schema',
					},
				],
			},
			{
				label: 'Status history',
				items: [
					{
						label: 'timestamped attestation lifecycle/status observations',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'recipient and attester EVM network accounts',
					},
				],
			},
			{
				label: 'Reference',
				items: [
					{
						label: 'ref attestation chain when present',
					},
				],
			},
			{
				label: 'Decoded data',
				items: [
					{
						label: 'schema-string decoded fields when resolver supports ABI-style schema',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'EAS contract getAttestation',
					},
					{
						label: 'Attested/Revoked logs',
					},
					{
						label: 'EAS Scan/indexer payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EasAttestation>
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
	entityType={EntityType.EasAttestation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
