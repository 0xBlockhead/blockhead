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
		'$method',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$method',
				'timestampMs',
				'source',
				'candidSignature',
				{
					label: 'certification support',
				},
				'requestCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Method',
				items: [
					{
						label: 'parent canister method',
					},
				],
			},
			{
				label: 'Canister',
				items: [
					{
						label: 'parent ICP canister through method',
					},
				],
			},
			{
				label: 'Interface',
				items: [
					'candidSignature',
					{
						label: 'metadata source',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Candid interface',
					},
					{
						label: 'certified metadata',
					},
					{
						label: 'or dashboard payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCanisterMethod_Timestamp>
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
	entityType={EntityType.IcpCanisterMethod_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
