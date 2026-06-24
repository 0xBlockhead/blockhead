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
		'address',
		{
			label: 'local name',
		},
		{
			label: 'legacy profile id',
		},
	],
	content: {
		dl: [
			[
				'address',
				{
					label: 'local name',
				},
				{
					label: 'legacy profile id',
				},
				{
					label: 'display name',
				},
				'bio',
				'owner',
				'score',
				{
					label: 'member state',
				},
				{
					label: 'created time',
				},
				{
					label: 'icon URL/media',
				},
				{
					label: 'username',
				},
				{
					label: 'latest follower/following snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Posts',
				items: [
					{
						label: 'posts authored by this account',
					},
				],
			},
			{
				label: 'Username',
				items: [
					{
						label: 'linked Lens username',
					},
				],
			},
			{
				label: 'Account managers',
				items: [
					{
						label: 'delegated manager permission rows',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped follower/following observations',
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
						label: 'account GraphQL payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.LensAccount>
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
	entityType={EntityType.LensAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
