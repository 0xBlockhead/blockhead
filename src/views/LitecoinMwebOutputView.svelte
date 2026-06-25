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
		'$transaction',
		'outputIndex',
		'commitment',
	],
	content: {
		dl: [
			[
				'$transaction',
				'outputIndex',
				'commitment',
				'senderPubkey',
				{
					label: 'local wallet match when available',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent MWEB transaction',
					},
				],
			},
			{
				label: 'Commitment',
				items: [
					{
						label: 'public output commitment',
					},
					{
						label: 'sender pubkey fields',
					},
				],
			},
			{
				label: 'Local wallet match',
				items: [
					{
						label: 'BlockheadLitecoinMwebOutputState when a connected wallet can identify ownership',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Litecoin Core MWEB output payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.LitecoinMwebOutput>
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
	entityType={EntityType.LitecoinMwebOutput}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
