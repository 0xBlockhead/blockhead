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
			'id',
			'username',
			{
				label: 'latest name',
			},
		],
		content: {
			dl: [
				[
					'id',
					'username',
					{
						label: 'created date',
					},
					{
						label: 'latest name',
					},
					{
						label: 'latest description',
					},
					{
						label: 'latest verified state',
					},
					{
						label: 'latest location',
					},
					{
						label: 'latest website URL',
					},
					{
						label: 'latest media',
					},
					{
						label: 'latest counters',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest profile',
					items: [
						{
							label: 'latest profile observation by timestamp/source',
						},
					],
				},
				{
					label: 'Profile history',
					items: [
						{
							label: 'profile observations',
						},
					],
				},
				{
					label: 'Posts',
					items: [
						{
							label: 'posts by this user',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'X v2 user lookup',
						},
						{
							label: 'FxEmbed user payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.XUser>
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
	entityType={EntityType.XUser}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
