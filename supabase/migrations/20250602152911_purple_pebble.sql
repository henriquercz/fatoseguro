/*
  # Create verifications table

  1. New Tables
    - `verifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `news` (text)
      - `source` (text, optional)
      - `is_true` (boolean)
      - `explanation` (text)
      - `related_facts` (text array)
      - `verified_at` (timestamp)

  2. Security
    - Enable RLS on `verifications` table
    - Add policies for authenticated users to read and create verifications
*/

CREATE TABLE IF NOT EXISTS public.verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  news text NOT NULL,
  source text,
  is_true boolean NOT NULL,
  explanation text NOT NULL,
  related_facts text[] DEFAULT '{}',
  verified_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all verifications"
  ON public.verifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create verifications"
  ON public.verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);