const prodOrigin = ['http://localhost:4173', 'http://localhost:3000'];

/** Development origins */
const devOrigin = [
  'http://localhost:8080',
  'ws://localhost:3000',
  'http://localhost:3000',
  `http://localhost:${process.env.PORT}`,
  '[::1]:3000',
  '[::1]:4173',
  '[::1]:5173',
];

const allowedOrigins =
  process.env.NODE_ENV === 'production' ? prodOrigin : devOrigin;

/** CORS options */
interface CorsOptions {
  allowedHeaders: string[];
  credentials: boolean;
  optionsSuccessStatus: number;
  exposedHeaders: string[];
  methods: string[];
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => void;
}

export const corsOptions: CorsOptions = {
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'authorization',
    'Origin',
    'X-Requested-With',
    'Accept',
  ],

  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
