#!/usr/bin/env python3
"""
Format Svelte <script lang="ts"> blocks per AGENTS.md (repo layout).

Section order (when present):
  Polyfills, Styles, View transitions  (+layout only)
  Types/constants → Context → Props → Inner context → Functions → State → Components → Transitions/animations

Reference: src/views/MarketVenueView.svelte, src/views/ProposalKindsView.svelte
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SECTION_ORDER = [
	'Polyfills',
	'Styles',
	'View transitions',
	'Types/constants',
	'Context',
	'Props',
	'Inner context',
	'Functions',
	'State',
	'(Derived)',
	'Components',
	'Transitions/animations',
]

LAYOUT_ONLY_SECTIONS = frozenset({'Polyfills', 'Styles', 'View transitions'})

SECTION_HEADER = re.compile(r'^\t// ([^\n]+)\s*$')

SCRIPT_TS = re.compile(
	r'(<script(?![^>]*\bmodule\b)(?![^>]*\bgenerics=)[^>]*\blang="ts"[^>]*>)([\s\S]*?)(</script>)',
	re.IGNORECASE,
)

MERGED_TYPE = re.compile(
	r'^(\t+)(id\?: string)\t+(limit\?: number|title\?: string)\s*$'
)
MERGED_TYPE2 = re.compile(r'^(\t+)(id: string)\t+(title\?: string)\s*$')
MERGED_TYPE3 = re.compile(r'^(\t+)(title\?: string)\t+(layout\?: EntityLayout)\s*$')

QUAD_TAB_PROP = re.compile(
	r'^\t\t\t\t(id|limit|title|open|collapsible|entityFieldReference|layout),?\s*$'
)
QUAD_TAB_PROP_EQ = re.compile(r'^\t\t\t\t(title|layout|open) =')


@dataclass
class Chunk:
	lines: list[str] = field(default_factory=list)
	section: str = 'State'


def repair_line(line: str) -> str:
	m = MERGED_TYPE.match(line)
	if m:
		indent, first, second = m.groups()
		return f'{indent}{first}\n{indent}{second}'
	m = MERGED_TYPE2.match(line)
	if m:
		indent, first, second = m.groups()
		return f'{indent}{first}\n{indent}{second}'
	m = MERGED_TYPE3.match(line)
	if m:
		indent, first, second = m.groups()
		return f'{indent}{first}\n{indent}{second}'
	if QUAD_TAB_PROP.match(line):
		return re.sub(r'^\t\t\t\t', '\t\t', line)
	if QUAD_TAB_PROP_EQ.match(line):
		return re.sub(r'^\t\t\t\t', '\t\t', line)
	if re.match(r'^\t\t\t(id|href|layout|open|limit|title|collapsible)\??', line):
		prev = repair_line.__dict__.get('_prev', '')
		if re.match(r'^\t\t(?:entityId|entityFieldReference):', prev):
			return re.sub(r'^\t\t\t', '\t\t', line)
	repair_line.__dict__['_prev'] = line.strip()
	return line.rstrip()


def repair_lines(lines: list[str]) -> list[str]:
	out: list[str] = []
	repair_line.__dict__['_prev'] = ''
	for line in lines:
		fixed = repair_line(line)
		out.extend(fixed.split('\n'))
	# drop duplicate // State on consecutive lines
	deduped: list[str] = []
	for line in out:
		if (
			line == '\t// State'
			and deduped
			and deduped[-1] == '\t// State'
		):
			continue
		deduped.append(line)
	return deduped


def is_import_start(line: str) -> bool:
	s = line.strip()
	return s.startswith('import ') or s.startswith('import{')


def import_is_complete(chunk: list[str]) -> bool:
	text = ''.join(chunk)
	return bool(re.search(r"\bfrom\s+['\"][^'\"]+['\"]", text, re.DOTALL))


def read_import(lines: list[str], i: int) -> tuple[list[str], int]:
	chunk = [lines[i]]
	i += 1
	while i < len(lines) and not import_is_complete(chunk):
		chunk.append(lines[i])
		i += 1
	return chunk, i


def _next_nonempty_line(lines: list[str], start: int) -> tuple[str | None, int]:
	j = start
	while j < len(lines):
		if lines[j].strip():
			return lines[j], j
		j += 1
	return None, j


def read_type_alias(lines: list[str], i: int) -> tuple[list[str], int]:
	chunk = [lines[i]]
	i += 1
	while i < len(lines):
		line = lines[i]
		stripped = line.strip()
		if not stripped:
			_nxt, j = _next_nonempty_line(lines, i + 1)
			if _nxt is not None:
				if (
					SECTION_HEADER.match(_nxt)
					or is_import_start(_nxt)
					or (
						_nxt.strip().startswith('let {')
						and '= $props()' not in _nxt
					)
					or _nxt.strip().startswith('const ')
				):
					break
			chunk.append(line)
			i += 1
			continue
		if SECTION_HEADER.match(line) or is_import_start(line):
			break
		if stripped.startswith('let {') and '= $props()' not in stripped:
			break
		if stripped.startswith('const '):
			break
		chunk.append(line)
		i += 1
	return chunk, i


def _is_top_level_decl(line: str) -> bool:
	stripped = line.strip()
	if SECTION_HEADER.match(line) or is_import_start(line):
		return True
	if stripped.startswith('type '):
		return True
	if stripped.startswith('let {') or stripped.startswith('let{'):
		return True
	if stripped.startswith('export '):
		return True
	return stripped.startswith('const ') or stripped.startswith('let ')


def _depth_delta(line: str) -> int:
	delta = 0
	for ch in line:
		if ch in '{[(':
			delta += 1
		elif ch in '})]':
			delta -= 1
	return delta


def read_statement(lines: list[str], i: int) -> tuple[list[str], int]:
	stmt = [lines[i]]
	depth = _depth_delta(lines[i])
	i += 1
	while i < len(lines):
		line = lines[i]
		if not line.strip():
			if depth == 0 and stmt:
				nxt, _j = _next_nonempty_line(lines, i + 1)
				if nxt is not None and _is_top_level_decl(nxt):
					i += 1
					break
			stmt.append(line)
			i += 1
			continue
		if depth == 0 and _is_top_level_decl(line):
			break
		stmt.append(line)
		depth += _depth_delta(line)
		i += 1
	return stmt, i


def read_props_block(lines: list[str], i: int) -> tuple[list[str], int]:
	chunk = [lines[i]]
	i += 1
	depth = 0
	started = False
	while i < len(lines):
		line = lines[i]
		chunk.append(line)
		for ch in line:
			if ch == '{':
				depth += 1
				started = True
			elif ch == '}':
				depth -= 1
		if started and depth <= 0 and '= $props()' in line:
			i += 1
			break
		i += 1
	while i < len(lines) and lines[i].strip() == '':
		i += 1
	return chunk, i


def classify_import(chunk: list[str]) -> str:
	text = ''.join(chunk)
	# Component modules only — not `*.svelte.ts` query modules
	if re.search(r"from\s+['\"][^'\"]*\.svelte['\"]", text):
		return 'Components'
	if re.search(r"from\s+['\"][^'\"]*\.(svg|png|jpg|webp)", text):
		return 'Components'
	if 'svelte/transition' in text or 'svelte/animation' in text or 'svelte/easing' in text:
		return 'Transitions/animations'
	if '$app/' in text or '$/context/' in text:
		return 'Context'
	if '$/collections/' in text:
		return 'State'
	if '$/lib/' in text:
		return 'State'
	if '$/constants/' in text or '$/schema/' in text or '$/sources/' in text or '$/typescript/' in text:
		return 'Types/constants'
	if 'devalue' in text or 'svelte/reactivity' in text:
		return 'Types/constants'
	return 'Types/constants'


def classify_statement(chunk: list[str]) -> str:
	text = ''.join(chunk).strip()
	if not text:
		return 'State'
	if text.startswith('let {') and '= $props()' in text:
		return 'Props'
	if re.search(r'\bset[A-Z]\w*\(', text) or 'getOnNestedCollapsibleClose' in text:
		return 'Inner context'
	if re.match(r'^if\s*\(', text) and 'incrementHeadingLevel' in text:
		return 'Inner context'
	if text.startswith('const {') and 'CollapsibleProps' in text:
		return 'Inner context'
	if 'collapsibleTabsPaneProps' in text or 'standaloneKindPanelsProps' in text:
		return 'Inner context'
	if 'standaloneRealmPanelsProps' in text:
		return 'Inner context'
	if re.match(r'^const \w+ = \(', text) and 'useEntity' not in text and '$derived' not in text:
		return 'Functions'
	if text.startswith('$derived') or '$derived.by(' in text or '$derived(' in text:
		return '(Derived)'
	if re.match(r'^const \w+ = \(', text) and 'derive' in text:
		return 'State'
	if 'useEntity(' in text or '$derived(' in text or '$state(' in text or '$effect(' in text:
		return 'State'
	if text.startswith('const ') or text.startswith('let '):
		return 'State'
	return 'State'


def parse_body(body: str, *, is_layout: bool) -> list[Chunk]:
	raw_lines = body.split('\n')
	# drop leading/trailing empty lines in body
	while raw_lines and not raw_lines[0].strip():
		raw_lines.pop(0)
	while raw_lines and not raw_lines[-1].strip():
		raw_lines.pop()

	lines = repair_lines(raw_lines)
	chunks: list[Chunk] = []
	i = 0
	while i < len(lines):
		line = lines[i]
		if not line.strip():
			i += 1
			continue

		header = SECTION_HEADER.match(line)
		if header:
			i += 1
			continue

		if is_import_start(line):
			import_lines, i = read_import(lines, i)
			chunks.append(Chunk(import_lines, classify_import(import_lines)))
			continue

		if line.strip().startswith('type '):
			type_lines, i = read_type_alias(lines, i)
			chunks.append(Chunk(type_lines, 'Types/constants'))
			continue

		stripped = line.strip()
		if (
			(stripped.startswith('let {') or stripped.startswith('let{'))
			and '= $props()' not in stripped
		):
			props_lines, i = read_props_block(lines, i)
			chunks.append(Chunk(props_lines, 'Props'))
			continue

		stmt, i = read_statement(lines, i)
		chunks.append(Chunk(stmt, classify_statement(stmt)))

	allowed = set(SECTION_ORDER)
	if not is_layout:
		allowed -= LAYOUT_ONLY_SECTIONS

	buckets: dict[str, list[Chunk]] = {name: [] for name in SECTION_ORDER}
	for chunk in chunks:
		section = chunk.section if chunk.section in allowed else 'State'
		buckets[section].append(chunk)

	ordered: list[Chunk] = []
	for name in SECTION_ORDER:
		if name in allowed:
			ordered.extend(buckets[name])
	return ordered


def is_single_line_import(chunk: Chunk) -> bool:
	return len(chunk.lines) == 1 and is_import_start(chunk.lines[0])


def needs_blank_line_between(previous: Chunk, current: Chunk) -> bool:
	if is_single_line_import(previous) and is_single_line_import(current):
		return False
	return True


def sort_section_chunks(chunks: list[Chunk]) -> list[Chunk]:
	imports: list[Chunk] = []
	types: list[Chunk] = []
	rest: list[Chunk] = []
	for chunk in chunks:
		first = chunk.lines[0].strip() if chunk.lines else ''
		if is_import_start(chunk.lines[0]):
			imports.append(chunk)
		elif first.startswith('type '):
			types.append(chunk)
		else:
			rest.append(chunk)
	return imports + types + rest


def emit_body(chunks: list[Chunk], *, is_layout: bool) -> str:
	allowed = [name for name in SECTION_ORDER if is_layout or name not in LAYOUT_ONLY_SECTIONS]
	by_section: dict[str, list[Chunk]] = {name: [] for name in allowed}
	for chunk in chunks:
		if chunk.section in by_section:
			by_section[chunk.section].append(chunk)

	parts: list[str] = []
	first_section = True
	for name in allowed:
		section_chunks = by_section[name]
		if not section_chunks:
			continue
		if not first_section:
			parts.append('')
			parts.append('')
		first_section = False
		parts.append(f'\t// {name}')
		section_chunks = sort_section_chunks(section_chunks)
		for ci, chunk in enumerate(section_chunks):
			if ci > 0 and needs_blank_line_between(section_chunks[ci - 1], chunk):
				parts.append('')
			parts.extend(chunk.lines)

	if not parts:
		return ''
	return '\n'.join(parts) + '\n'


def format_file_content(content: str, *, path: Path) -> str:
	is_layout = path.name == '+layout.svelte'

	def fix_script(m: re.Match[str]) -> str:
		opening, body, closing = m.group(1), m.group(2), m.group(3)
		chunks = parse_body(body, is_layout=is_layout)
		new_body = emit_body(chunks, is_layout=is_layout)
		# Preserve newline after opening script tag
		if body.startswith('\n') and not new_body.startswith('\n'):
			new_body = '\n' + new_body
		return opening + new_body + closing

	content = content.replace("<script lang='ts'>", '<script lang="ts">')
	content = SCRIPT_TS.sub(fix_script, content)

	content = re.sub(
		r'</script>[ \t]*(?:\r?\n[ \t]*)*(?=(?:\r?\n)*[<{])',
		'</script>\n\n\n',
		content,
	)
	content = re.sub(
		r'</svelte:head>[ \t]*(?:\r?\n[ \t]*)*(?=(?:\r?\n)*[<{])',
		'</svelte:head>\n\n\n',
		content,
	)
	lines = [line.rstrip() for line in content.split('\n')]
	content = '\n'.join(lines)
	if not content.endswith('\n'):
		content += '\n'
	return content


def main() -> int:
	parser = argparse.ArgumentParser(description=__doc__)
	parser.add_argument(
		'paths',
		nargs='*',
		type=Path,
		help='Files or directories (default: src/views src/components src/routes)',
	)
	parser.add_argument('--check', action='store_true', help='Exit 1 if any file would change')
	args = parser.parse_args()

	if args.paths:
		targets: list[Path] = []
		for p in args.paths:
			p = p if p.is_absolute() else ROOT / p
			if p.is_dir():
				targets.extend(sorted(p.rglob('*.svelte')))
			elif p.is_file():
				targets.append(p)
	else:
		targets = []
		for sub in ('views', 'components', 'routes'):
			d = ROOT / 'src' / sub
			if d.is_dir():
				targets.extend(sorted(d.rglob('*.svelte')))

	changed: list[Path] = []
	for path in targets:
		raw = path.read_text(encoding='utf-8')
		new = format_file_content(raw, path=path)
		if new != raw:
			changed.append(path)
			if not args.check:
				path.write_text(new, encoding='utf-8', newline='\n')

	if args.check:
		if changed:
			for p in changed:
				print(p.relative_to(ROOT))
			print(f'{len(changed)} file(s) need formatting', file=sys.stderr)
			return 1
		print('all files formatted')
		return 0

	for p in changed:
		print(p.relative_to(ROOT))
	print(f'formatted {len(changed)} / {len(targets)} files')
	return 0


if __name__ == '__main__':
	sys.exit(main())
