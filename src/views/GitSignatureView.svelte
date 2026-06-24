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
			label: 'signature id',
		},
		{
			label: 'subject object id',
		},
		{
			label: 'signature kind',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'signature id',
				},
				{
					label: 'subject object id',
				},
				{
					label: 'signature kind',
				},
				{
					label: 'signer selector',
				},
				{
					label: 'payload hash',
				},
				{
					label: 'verification status',
				},
				{
					label: 'verified timestamp',
				},
				'verifier',
				{
					label: 'evidence URL',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Subject',
				items: [
					{
						label: 'GitObject/GitCommit/GitTag/RadicleSignedRef context',
					},
				],
			},
			{
				label: 'Raw signature',
				items: [
					{
						label: 'redacted signature text',
					},
				],
			},
			{
				label: 'Verification evidence',
				items: [
					{
						label: 'verifier/evidence fields',
					},
					{
						label: 'local verification output when retained',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitSignature>
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
	entityType={EntityType.GitSignature}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
