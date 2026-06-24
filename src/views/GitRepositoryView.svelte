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
			'repositoryId',
		],
		content: {
			dl: [
				[
					'repositoryId',
					'canonicalRemoteUrl',
					'defaultRefName',
					'objectFormat',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'refs',
					when: 'open',
					items: [
						'$$refs',
					],
				},
				{
					label: 'objects',
					when: 'open',
					items: [
						'$$objects',
					],
				},
				{
					label: 'remotes',
					when: 'open',
					items: [
						'$$remotes',
					],
				},
				{
					label: 'fetches',
					when: 'open',
					items: [
						'$$fetches',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitRepository>
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
	entityType={EntityType.GitRepository}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
