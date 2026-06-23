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
			'fid',
			'username',
			{
				label: 'display name',
			},
		],
		content: {
			dl: [
				[
					'fid',
					'username',
					{
						label: 'display name',
					},
					{
						label: 'icon URL/media',
					},
					'bio',
					{
						label: 'URL',
					},
					{
						label: 'primary EVM account',
					},
					{
						label: 'verified address count',
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
					label: 'Casts',
					items: [
						{
							label: 'casts authored by this FID',
						},
					],
				},
				{
					label: 'Verified addresses',
					items: [
						{
							label: 'verified-address rows',
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
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterUser>
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
	entityType={EntityType.FarcasterUser}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
