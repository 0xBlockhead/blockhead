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
			label: 'token',
		},
		{
			label: 'serial number',
		},
		{
			label: 'created timestamp',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'token',
				},
				{
					label: 'serial number',
				},
				{
					label: 'created timestamp',
				},
				{
					label: 'metadata summary',
				},
				{
					label: 'latest owner/deleted/spender state',
				},
				{
					label: 'transfer count',
				},
				{
					label: 'timestamp count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest NFT serial-state observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped NFT serial-state observations',
					},
				],
			},
			{
				label: 'Transfer history',
				items: [
					{
						label: 'token transfer rows for this serial',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'decoded/raw metadata',
					},
				],
			},
			{
				label: 'Allowances',
				items: [
					{
						label: 'serial approval allowance rows',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'NFT payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNft>
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
	entityType={EntityType.HederaNft}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
