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
				label: 'signed ref',
			},
			{
				label: 'timestamp',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'signed ref',
					},
					{
						label: 'timestamp',
					},
					'source',
					{
						label: 'target object id',
					},
					{
						label: 'signature status',
					},
					{
						label: 'object availability',
					},
					{
						label: 'delegate-threshold result',
					},
					'status',
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Signed ref',
					items: [
						{
							label: 'parent Radicle signed ref',
						},
					],
				},
				{
					label: 'Target object',
					items: [
						{
							label: 'Git object or commit target',
						},
					],
				},
				{
					label: 'Repository',
					items: [
						{
							label: 'parent Radicle repository',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'CLI/storage/git-remote diagnostics',
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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleSignedRef_Timestamp>
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
	entityType={EntityType.RadicleSignedRef_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
