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
			label: 'network',
		},
		'address',
		{
			label: 'latest indexed user-operation count',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				'address',
				{
					label: 'latest indexed user-operation count',
				},
				{
					label: 'optional contract',
				},
				{
					label: 'operator account address',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'User operations',
				items: [
					{
						label: 'user operations bundled by this address when source-filtered or operation detail links exist',
					},
				],
			},
			{
				label: 'Count snapshots',
				items: [
					{
						label: 'timestamped bundler count observations',
					},
				],
			},
			{
				label: 'Operator account',
				items: [
					{
						label: 'bundler EVM account',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'bundler EVM contract when code is detected',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent EVM network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Blockscout bundler detail/list payload',
					},
					{
						label: 'pagination context',
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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4337Bundler>
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
	entityType={EntityType.Erc4337Bundler}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
