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
			label: 'CCTP version/domain id',
		},
		'name',
		{
			label: 'linked network',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'CCTP version',
				},
				{
					label: 'domain id',
				},
				'name',
				{
					label: 'linked network',
				},
				{
					label: 'standard/fast source support',
				},
				{
					label: 'forwarding destination support',
				},
				{
					label: 'supported token count',
				},
				{
					label: 'contract address availability',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Messages',
				items: [
					{
						label: 'CCTP messages scoped to the domain support entry',
					},
				],
			},
			{
				label: 'Burn fees',
				items: [
					{
						label: 'timestamped burn-fee observations for source/destination pairs',
					},
				],
			},
			{
				label: 'Contracts',
				items: [
					{
						label: 'token messenger',
					},
					{
						label: 'message transmitter',
					},
					{
						label: 'token minter addresses',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'mapped Network row when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.CctpDomainSupport>
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
	entityType={EntityType.CctpDomainSupport}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
