import { Test, TestingModule } from '@nestjs/testing';
import { CubiclesController } from '../controller/cubicles.controller';

describe('Cubicles Controller', () => {
  let controller: CubiclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CubiclesController],
    }).compile();

    controller = module.get<CubiclesController>(CubiclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
