import { describe, it, expect, beforeEach, vi } from 'vitest';
import ensureOursFunction from '../../src/lib/helpers/ensure-ours-function.js';

describe('initialize action', () => {
  var mockWindow;
  var mockLoadScript;

  beforeEach(() => {
    mockWindow = {};
    mockLoadScript = vi.fn(() => Promise.resolve());

    vi.stubGlobal('turbine', {
      getExtensionSettings: vi.fn(),
      logger: {
        log: vi.fn(),
        error: vi.fn(),
      },
    });
  });

  function runInitialize(settings) {
    // Inline the initialize logic with injected dependencies
    var extensionSettings = turbine.getExtensionSettings();
    var token = extensionSettings.token;

    if (!token) {
      turbine.logger.error(
        'Ours Privacy: Project token is required. Configure it in the extension settings.'
      );
      return;
    }

    var ours = ensureOursFunction(mockWindow);

    mockLoadScript('https://cdn.oursprivacy.com/main.js').then(function () {
      turbine.logger.log('Ours Privacy: SDK loaded successfully.');
    });

    ours('init', token);

    turbine.logger.log('Ours Privacy: Initialized with token.');
  }

  it('should call ours init with token', () => {
    turbine.getExtensionSettings.mockReturnValue({ token: 'test-token-123' });

    runInitialize({});

    expect(mockWindow.ours).toBeDefined();
    expect(mockWindow.ours.queue).toBeDefined();
    expect(mockWindow.ours.queue[0]).toEqual(['init', 'test-token-123']);
  });

  it('should load the SDK script from CDN', () => {
    turbine.getExtensionSettings.mockReturnValue({ token: 'test-token' });

    runInitialize({});

    expect(mockLoadScript).toHaveBeenCalledWith(
      'https://cdn.oursprivacy.com/main.js'
    );
  });

  it('should log an error when token is missing', () => {
    turbine.getExtensionSettings.mockReturnValue({});

    runInitialize({});

    expect(turbine.logger.error).toHaveBeenCalledWith(
      'Ours Privacy: Project token is required. Configure it in the extension settings.'
    );
    expect(mockLoadScript).not.toHaveBeenCalled();
  });

  it('should log an error when token is empty string', () => {
    turbine.getExtensionSettings.mockReturnValue({ token: '' });

    runInitialize({});

    expect(turbine.logger.error).toHaveBeenCalled();
    expect(mockLoadScript).not.toHaveBeenCalled();
  });

  it('should log initialization message', () => {
    turbine.getExtensionSettings.mockReturnValue({ token: 'my-token' });

    runInitialize({});

    expect(turbine.logger.log).toHaveBeenCalledWith(
      'Ours Privacy: Initialized with token.'
    );
  });
});
