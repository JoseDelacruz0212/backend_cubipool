import { Test, TestingModule } from '@nestjs/testing';
import { CubiclesService } from '../services/cubicles.service';

describe('CubiclesService', () => {
  let service: CubiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CubiclesService],
    }).compile();

    service = module.get<CubiclesService>(CubiclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
