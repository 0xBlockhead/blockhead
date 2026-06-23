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
				label: 'token timestamp',
			},
			{
				label: 'fee index',
			},
			{
				label: 'fee kind',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'token timestamp',
					},
					{
						label: 'fee index',
					},
					{
						label: 'fee kind',
					},
					{
						label: 'collector',
					},
					{
						label: 'denominating token',
					},
					{
						label: 'fixed amount',
					},
					{
						label: 'fractional numerator/denominator',
					},
					{
						label: 'min/max amounts',
					},
					{
						label: 'net-of-transfers flag',
					},
					{
						label: 'collector exemption flag',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Token state',
					items: [
						{
							label: 'parent token-info observation',
						},
					],
				},
				{
					label: 'Token',
					items: [
						{
							label: 'Hedera token through timestamp',
						},
					],
				},
				{
					label: 'Collector',
					items: [
						{
							label: 'collector Hedera account',
						},
					],
				},
				{
					label: 'Denominating token',
					items: [
						{
							label: 'denominating Hedera token',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'token custom fee payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTokenCustomFee>
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
	entityType={EntityType.HederaTokenCustomFee}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
