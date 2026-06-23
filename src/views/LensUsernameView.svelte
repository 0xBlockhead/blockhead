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
			'namespace',
			{
				label: 'local name',
			},
			'id',
		],
		content: {
			dl: [
				[
					'namespace',
					{
						label: 'local name',
					},
					'id',
					'value',
					{
						label: 'owner',
					},
					{
						label: 'linked account',
					},
					{
						label: 'minted timestamp',
					},
					{
						label: 'namespace ref',
					},
					{
						label: 'account ref',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Namespace',
					items: [
						{
							label: 'parent username namespace',
						},
					],
				},
				{
					label: 'Linked account',
					items: [
						{
							label: 'linked Lens account',
						},
					],
				},
				{
					label: 'Owner',
					items: [
						{
							label: 'owner EVM account when resolved',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'username GraphQL payload',
						},
						{
							label: 'namespace token events when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.LensUsername>
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
	entityType={EntityType.LensUsername}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
