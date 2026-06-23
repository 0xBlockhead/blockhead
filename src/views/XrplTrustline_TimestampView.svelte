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
				label: 'trustline',
			},
			{
				label: 'ledger index',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'trustline',
					},
					{
						label: 'ledger index',
					},
					'source',
					{
						label: 'observation time',
					},
					'balance',
					{
						label: 'limits',
					},
					{
						label: 'no-ripple/authorization flags',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Trustline',
					items: [
						{
							label: 'XrplTrustline',
						},
					],
				},
				{
					label: 'Balances/limits',
					items: [
						'balance',
						'limit',
						{
							label: 'peer limit',
						},
					],
				},
				{
					label: 'Flags',
					items: [
						{
							label: 'no-ripple',
						},
						{
							label: 'peer no-ripple',
						},
						'authorized',
						{
							label: 'peer authorized',
						},
					],
				},
				{
					label: 'Ledger context',
					items: [
						{
							label: 'ledger index',
						},
						{
							label: 'observation time',
						},
						'source',
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'account_lines/ledger entry/explorer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplTrustline_Timestamp>
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
	entityType={EntityType.XrplTrustline_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
