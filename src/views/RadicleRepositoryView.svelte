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
				label: 'RID',
			},
			{
				label: 'linked Git repository',
			},
			'name',
		],
		content: {
			dl: [
				[
					{
						label: 'RID',
					},
					{
						label: 'linked Git repository',
					},
					'name',
					'description',
					'visibility',
					{
						label: 'default branch',
					},
					{
						label: 'delegate count',
					},
					{
						label: 'latest signed-ref status',
					},
					{
						label: 'issue count',
					},
					{
						label: 'patch count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Identity',
					items: [
						{
							label: 'identity documents',
						},
						{
							label: 'identity revisions',
						},
						{
							label: 'delegates',
						},
					],
				},
				{
					label: 'Signed refs',
					items: [
						{
							label: 'signed refs by node/ref',
						},
					],
				},
				{
					label: 'Collaboration',
					items: [
						{
							label: 'issues/patches/comments/events',
						},
					],
				},
				{
					label: 'Replication',
					items: [
						{
							label: 'BlockheadRadicleSeedObservation_Timestamp rows when a connected node observes availability',
						},
					],
				},
				{
					label: 'Git storage',
					items: [
						{
							label: 'linked Git repository',
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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleRepository>
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
	entityType={EntityType.RadicleRepository}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
