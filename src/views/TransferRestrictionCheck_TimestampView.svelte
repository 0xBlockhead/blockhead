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
				label: 'restriction',
			},
			{
				label: 'observation time',
			},
			{
				label: 'subject',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'restriction',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'subject key',
					},
					{
						label: 'account',
					},
					'amount',
				],
				[
					{
						label: 'can transfer',
					},
					'reason',
					{
						label: 'ledger coordinate',
					},
					{
						label: 'validity window',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Restriction',
					items: [
						{
							label: 'parent restriction rule',
						},
					],
				},
				{
					label: 'Account',
					items: [
						{
							label: 'scoped account when resolved',
						},
					],
				},
				{
					label: 'Eligibility',
					items: [
						{
							label: 'materialized account/asset eligibility row',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'canTransfer/isVerified call',
						},
						{
							label: 'transfer-hook simulation',
						},
						{
							label: 'account-set membership',
						},
						{
							label: 'event/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TransferRestrictionCheck_Timestamp>
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
	entityType={EntityType.TransferRestrictionCheck_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
