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
				label: 'UID',
			},
			{
				label: 'schema',
			},
			{
				label: 'recipient/attester',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'UID',
					},
					{
						label: 'network',
					},
					{
						label: 'schema UID',
					},
					'recipient',
					'attester',
					{
						label: 'ref UID',
					},
					{
						label: 'attested time',
					},
					{
						label: 'expiration time',
					},
					{
						label: 'revocable flag',
					},
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
