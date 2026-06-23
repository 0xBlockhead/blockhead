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
			'revision',
			{
				label: 'previous revision',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'RID',
					},
					'revision',
					{
						label: 'previous revision',
					},
					{
						label: 'document hash',
					},
					'threshold',
					{
						label: 'verification status',
					},
					{
						label: 'delegate DIDs',
					},
					{
						label: 'signer DIDs',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Document',
					items: [
						{
							label: 'identity document for this revision',
						},
					],
				},
				{
					label: 'Delegates',
					items: [
						{
							label: 'delegate rows',
						},
					],
				},
				{
					label: 'Previous revision',
					items: [
						{
							label: 'previous identity revision',
						},
					],
				},
				{
					label: 'Verification',
					items: [
						{
							label: 'signatures/results',
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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleIdentityRevision>
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
	entityType={EntityType.RadicleIdentityRevision}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
