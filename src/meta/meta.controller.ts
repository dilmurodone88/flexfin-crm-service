import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RegistryService } from '../registry/registry.service';
import { ModelEntry } from '../registry/registry.types';

const describe = (m: ModelEntry) => ({
  model: m.name,
  table: m.table,
  pk: m.pk,
  fields: [...m.fields.values()].map((f) => ({ name: f.name, type: f.type, required: f.isRequired })),
  references: Object.fromEntries(
    [...m.refs].map(([c, r]) => [c, r.parent ? `${r.parent.name}.${r.parentColumn}` : `${r.parentName}.${r.parentColumn} (modelsiz)`]),
  ),
  referencedBy: m.referencedBy.map((r) => ({ model: r.child.name, by: r.column })),
});

@ApiTags('meta')
@ApiSecurity('apiKey')
@Controller('v1')
export class MetaController {
  constructor(private readonly registry: RegistryService) {}

  @Get('models')
  @ApiOperation({ summary: "Barcha modellar: primary key, maydonlar, bog'lanishlar (references / referencedBy)" })
  models() {
    return {
      count: this.registry.models.size,
      data: [...this.registry.models.values()].map(describe),
      rawTables: [...this.registry.rawTables.values()].map((t) => ({ table: `${t.sch}.${t.tbl}`, columns: t.cols.map((c) => c.name) })),
    };
  }

  @Get('_graph')
  @ApiOperation({ summary: "Bog'lanishlar grafi (qirralar ro'yxati)" })
  graph() {
    const edges: { from: string; to: string }[] = [];
    for (const m of this.registry.models.values()) {
      for (const [c, r] of m.refs) edges.push({ from: `${m.name}.${c}`, to: `${r.parent ? r.parent.name : r.parentName}.${r.parentColumn}` });
    }
    return { count: edges.length, edges };
  }
}
